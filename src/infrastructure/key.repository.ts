import { v4 as uuidv4 } from 'uuid'
import type { IKeyRepositoryInterface, KeySetType } from '../domain/key.repository.interface';
import { inject, injectable } from 'inversify';
import { HTTPException } from 'hono/http-exception';
import type { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClientType } from './prisma';
import { KEY_BASE_OPTIONS } from '../utils/const';

const iv = new ArrayBuffer(12);

@injectable()
export class KeyRepository implements IKeyRepositoryInterface {
    readonly _kid: string
    @inject(PrismaClientType.PrismaClient)
    private readonly prisma: PrismaClient;

    constructor(prisma: PrismaClient, kid?: string) {
        this._kid = kid ?? uuidv4()
        this.prisma = prisma;
    }

    async generateSignKeys() {
        const keyPair = await crypto.subtle.generateKey(
            {
                ...KEY_BASE_OPTIONS,
            },
            true,
            ['sign', 'verify']
        );

        if (keyPair instanceof CryptoKey) {
            throw new HTTPException(500, { message: 'Failed to generate key pair' })
        }

        return {
            kid: this._kid,
            ...keyPair,
        }
    }

    async saveKeys(kid: string, keys: { publicKey: CryptoKey, privateKey: CryptoKey }): Promise<void> {
        let wrapKey = (await this.prisma.wrapKey.findFirst())?.key
        if (!wrapKey) {
            wrapKey = await this.findOrCreateWrapKey();
        }
        const publicKey = await crypto.subtle.exportKey('jwk', keys.publicKey);
        if ((publicKey instanceof ArrayBuffer)) {
            throw new HTTPException(500, { message: 'Failed to export key' })
        }

        const aesKey = await crypto.subtle.importKey('raw', this.convertBase64StringToArrayBufferView(wrapKey), {
            name: 'AES-GCM',
        }, true, ['wrapKey', 'unwrapKey']);

        const wrappedPrivateKey = await crypto.subtle.wrapKey('pkcs8', keys.privateKey, aesKey, {
            name: "AES-GCM",
            iv,
        });

        // const pemExported = `${pemHeader}\n${this.encodeBase64(wrappedPrivateKey)}\n${pemFooter}`;

        await this.prisma.signKey.create({
            data: {
                kid,
                privateKey: this.encodeBase64(wrappedPrivateKey),
                publicKey: JSON.stringify(publicKey)
            }
        })
    }

    async findOrCreateWrapKey() {
        const wrapKey = await this.prisma.wrapKey.findFirst()
        if (!wrapKey) {
            const aesKey = await crypto.subtle.generateKey(
                {
                    name: 'AES-GCM',
                    length: 256,
                },
                true,
                ['wrapKey', 'unwrapKey']
            );
            if (!(aesKey instanceof CryptoKey)) {
                throw new HTTPException(500, { message: 'Failed to generate key pair' })
            }

            const exportWrapKey = await crypto.subtle.exportKey('raw', aesKey);

            if (!(exportWrapKey instanceof ArrayBuffer)) {
                throw new HTTPException(500, { message: 'Failed to export key' })
            }

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

    async getKeys(wrapKey: string, kid?: string[]) {

        const importWrapKey = await crypto.subtle.importKey('raw', this.convertBase64StringToArrayBufferView(wrapKey), {
            name: 'AES-GCM',
            length: 256,
        }, true, ['wrapKey', 'unwrapKey']);


        const keys = await this.prisma.signKey.findMany({ where: { kid: { in: kid } } });

        const exec = keys.map(async (key) => {
            const publicKey = await crypto.subtle.importKey('jwk', JSON.parse(key.publicKey), KEY_BASE_OPTIONS, true, ['verify']);
            const privateKey = await crypto.subtle.unwrapKey('pkcs8', this.convertBase64StringToArrayBufferView(key.privateKey), importWrapKey, {
                name: "AES-GCM",
                iv,
            }, KEY_BASE_OPTIONS, true, ['sign']);

            return {
                kid: key.kid,
                publicKey,
                privateKey
            }
        });

        return Promise.all(exec)
    }

    async exportPublicKeys() {
        const alreadyExistKeys = await this.prisma.signKey.findMany();
        const keys = alreadyExistKeys.map((key) => {
            return {
                kid: key.kid,
                ...JSON.parse(key.publicKey)
            }
        });

        return { keys }
    }

    private encodeBase64(buffer: ArrayBuffer) {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    }

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