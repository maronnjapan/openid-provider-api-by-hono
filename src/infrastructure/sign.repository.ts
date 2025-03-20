import { injectable } from "inversify";
import type { ISignRepositoryInterface, TokenHeader } from "../domain/sign.repository.interface";
import { KEY_BASE_OPTIONS } from "../utils/const";

@injectable()
export class SignRepository implements ISignRepositoryInterface {
    /**
     * JWSの作成を行う
     */
    async sign(payload: Record<string, unknown>, header: TokenHeader, secretKey: CryptoKey) {
        const encoder = new TextEncoder()

        /**
         * ヘッダーとペイロードをそれぞれURLで使用可能な形式にエンコード
         */
        const payloadEncoded = this.encodeBase64Url(encoder.encode(JSON.stringify(payload)).buffer)
        const headerEncoded = this.encodeBase64Url(encoder.encode(JSON.stringify(header)).buffer)
        /**
         * 署名対象の部分を作成
         */
        const partialToken = `${headerEncoded}.${payloadEncoded}`
        /**
         * 署名を作成
         */
        const signPart = await crypto.subtle.sign(KEY_BASE_OPTIONS, secretKey, encoder.encode(partialToken))
        /**
         * 署名をURLで使用可能な形式にエンコード
         */
        const signEncoded = this.encodeBase64Url(signPart).replace(/=/g, '')

        /**
         * Header.Payload.Signatureの形式でJWSを作成
         */
        return `${partialToken}.${signEncoded}`;
    }

    private encodeBase64Url(buf: ArrayBufferLike): string {
        return this.encodeBase64(buf).replace(/\/|\+/g, (m) => ({ '/': '_', '+': '-' }[m] ?? m)).replace(/=/g, '')
    }

    private encodeBase64(buf: ArrayBufferLike): string {
        let binary = ''
        const bytes = new Uint8Array(buf)
        for (let i = 0, len = bytes.length; i < len; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return btoa(binary)
    }
}