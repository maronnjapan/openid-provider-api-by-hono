import { v4 as uuidv4 } from 'uuid'
import type { IKeyRepositoryInterface } from '../domain/key.repository.interface';
import { inject, injectable } from 'inversify';
import { HTTPException } from 'hono/http-exception';
import type { PrismaClient } from '@prisma/client';
import { PrismaClientType } from './prisma';
import { KEY_BASE_OPTIONS } from '../utils/const';

@injectable()
export class KeyRepository implements IKeyRepositoryInterface {
    @inject(PrismaClientType.PrismaClient)
    private readonly prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async generateSignKeys() {
        /**
         * ECDSAの公開鍵・秘密鍵のペアを生成
         */
        const keyPair = await crypto.subtle.generateKey(
            {
                ...KEY_BASE_OPTIONS,
            },
            true,
            /**
             * 用途はJWTの署名・検証のためなので、signとverifyを指定
             * https://developer.mozilla.org/ja/docs/Web/API/SubtleCrypto/generateKey#keyusages
             */
            ['sign', 'verify']
        );

        if (keyPair instanceof CryptoKey) {
            throw new HTTPException(500, { message: 'Failed to generate key pair' })
        }

        return {
            kid: uuidv4(),
            ...keyPair,
        }
    }

    async saveKeys(kid: string, keys: { publicKey: CryptoKey, privateKey: CryptoKey }): Promise<void> {
        /**
         * 秘密鍵を暗号化するためのAESキーを取得
         */
        let wrapKey = (await this.prisma.wrapKey.findFirst())?.key
        if (!wrapKey) {
            /**
             * 秘密鍵を暗号化するためのAESキーが存在しない場合は作成
             */
            wrapKey = await this.findOrCreateWrapKey();
        }
        /**
         * 公開鍵はJSON形式で提供するためにJWK形式へ変換
         */
        const publicKey = await crypto.subtle.exportKey('jwk', keys.publicKey);
        if ((publicKey instanceof ArrayBuffer)) {
            throw new HTTPException(500, { message: 'Failed to export key' })
        }

        /**
         * DBへ文字列保存したAESの鍵をCryptoKeyに変換
         * この鍵を使って秘密鍵を暗号化
         * wrapKeyは文字列変換→Base64エンコードされているので、元のArrayBufferに戻してからCryptoKeyに変換する
         */
        const aesKey = await crypto.subtle.importKey('raw', this.convertBase64StringToArrayBufferView(wrapKey), {
            name: 'AES-GCM',
        }, true, ['wrapKey', 'unwrapKey']);

        /**
         * 初期化ベクトルを生成
         * 初期化ベクトルは使い回してはいけないので、毎回生成する
         */
        const iv = crypto.getRandomValues(new Uint8Array(12)).buffer

        /**
         * 秘密鍵をAES-GCMのアルゴリズムで暗号化した上で、pkcs8形式で出力する
         */
        const wrappedPrivateKey = await crypto.subtle.wrapKey('pkcs8', keys.privateKey, aesKey, {
            name: "AES-GCM",
            iv,
        });

        /**
         * 秘密鍵と公開鍵は一緒に保存する必要があるため、エラーが発生した場合は両者を削除
         * Prismaを使用している場合は、通常$transactionで囲めば良い。
         * ただし、今回はCloudflare D1を使用しているため、トランザクションがサポートされていない
         * https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1#limitations
         * そのため、明示的に削除処理を行っている
         */
        try {
            await this.prisma.privateKey.create({
                data: {
                    kid,
                    /**
                     * 初期化ベクトルは秘匿しておく必要はないので、秘密鍵の先頭に付与させる
                     * また、初期化ベクトル・暗号化された秘密鍵はArrayBufferなので文字列として保存しておくためにBase64エンコードする
                     */
                    privateKey: `${this.encodeBase64(iv)}:${this.encodeBase64(wrappedPrivateKey)}`,
                }
            })
            await this.prisma.publicKey.create({
                data: {
                    kid,
                    publicKey: JSON.stringify(publicKey),
                }
            })
        } catch (e) {
            await this.prisma.privateKey.delete({
                where: {
                    kid
                }
            })
            await this.prisma.publicKey.delete({
                where: {
                    kid
                }
            })
            throw e;
        }
    }

    /** AESの鍵を作成し、DBに保存 */
    async findOrCreateWrapKey() {
        const wrapKey = await this.prisma.wrapKey.findFirst()
        if (!wrapKey) {
            /**
             * AESの鍵を生成
             */
            const aesKey = await crypto.subtle.generateKey(
                {
                    name: 'AES-GCM',
                    length: 256,
                },
                true,
                /**
                 * 用途はECDSAの秘密鍵を暗号・複合するためなので、wrapKeyとunwrapKeyを指定
                 * https://developer.mozilla.org/ja/docs/Web/API/SubtleCrypto/generateKey#keyusages
                 */
                ['wrapKey', 'unwrapKey']
            );
            if (!(aesKey instanceof CryptoKey)) {
                throw new HTTPException(500, { message: 'Failed to generate key pair' })
            }

            /**
             * DBに保存するためにRawデータに変換
             */
            const exportWrapKey = await crypto.subtle.exportKey('raw', aesKey);

            if (!(exportWrapKey instanceof ArrayBuffer)) {
                throw new HTTPException(500, { message: 'Failed to export key' })
            }

            /**
             *  RawデータをBase64にエンコードし、DBに保存
             */
            const decodeWrapKey = this.encodeBase64(exportWrapKey);
            await this.prisma.wrapKey.create({
                data: {
                    key: decodeWrapKey
                }
            })

            return decodeWrapKey;
        }
        return wrapKey.key
    }

    async getPrivateKeys(wrapKey: string, kid?: string[]) {

        /**
         * 秘密鍵を複合するためのAESの鍵を複合できる形でインポートする
         * この時、wrapKeyはBase64エンコードされているので、デコードしてArrayBufferに変換する
         */
        const importWrapKey = await crypto.subtle.importKey('raw', this.convertBase64StringToArrayBufferView(wrapKey), {
            name: 'AES-GCM',
            length: 256,
        }, true, ['wrapKey', 'unwrapKey']);


        const privateKeys = await this.prisma.privateKey.findMany({ where: { kid: { in: kid } } });
        const publicKeys = await this.prisma.publicKey.findMany({ where: { kid: { in: kid } } });

        /**
         * 公開鍵と秘密鍵のペアで存在するものだけを取得
         */
        const keys = privateKeys.filter((privateKey) => {
            return publicKeys.some((publicKey) => {
                return publicKey.kid === privateKey.kid
            })
        });

        const exec = keys.map(async (key) => {
            /**
             * 秘密鍵を複合するための初期化ベクトルと暗号化された秘密鍵を取得
             * 初期化ベクトルと暗号化された秘密鍵はBase64エンコードされているので、デコードしてArrayBufferに変換する
             */
            const [iv, wrappedPrivateKey] = key.privateKey.split(':').map((str) => this.convertBase64StringToArrayBufferView(str
            ));

            /**
             * 秘密鍵をAES-GCMのアルゴリズムで複合する
             */
            const privateKey = await crypto.subtle.unwrapKey('pkcs8', wrappedPrivateKey, importWrapKey, {
                name: "AES-GCM",
                iv,
            }, KEY_BASE_OPTIONS, true, ['sign']);

            return {
                kid: key.kid,
                privateKey
            }
        });

        return Promise.all(exec)
    }

    /**
     * 公開鍵をJWKSの形式でエクスポートできる形に変換
     */
    async exportPublicKeys() {
        const alreadyExistKeys = await this.prisma.publicKey.findMany();
        const keys = alreadyExistKeys.map((key) => {
            return {
                kid: key.kid,
                ...JSON.parse(key.publicKey)
            }
        });

        return { keys }
    }

    /**
     * ArrayBufferをBase64にエンコード
     */
    private encodeBase64(buffer: ArrayBuffer) {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    }

    /**
     * Base64エンコードされた文字列をArrayBufferに変換
     */
    private convertBase64StringToArrayBufferView(str: string) {
        const decodeString = atob(str);
        const buf = new ArrayBuffer(decodeString.length);
        const bufView = new Uint8Array(buf);
        for (let i = 0, strLen = decodeString.length; i < strLen; i++) {
            bufView[i] = decodeString.charCodeAt(i);
        }
        return buf;
    }

}