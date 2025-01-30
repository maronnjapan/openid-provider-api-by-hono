import { injectable } from "inversify";
import type { ISignRepositoryInterface, TokenHeader } from "../domain/sign.repository.interface";
import jwt from 'jsonwebtoken'


@injectable()
export class SignRepository implements ISignRepositoryInterface {
    async sign(payload: Record<string, unknown>, header: TokenHeader, secretKey: CryptoKey) {
        const encoder = new TextEncoder()

        const payloadEncoded = this.encodeBase64Url(encoder.encode(JSON.stringify(payload)).buffer).replace(/=/g, '')
        const headerEncoded = this.encodeBase64Url(encoder.encode(JSON.stringify(header)).buffer).replace(/=/g, '')
        const partialToken = `${headerEncoded}.${payloadEncoded}`
        const signPart = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', secretKey, encoder.encode(partialToken))
        const signEncoded = this.encodeBase64Url(signPart).replace(/=/g, '')

        return `${partialToken}.${signEncoded}`;
    }

    private encodeBase64Url(buf: ArrayBufferLike): string {
        return this.encodeBase64(buf).replace(/\/|\+/g, (m) => ({ '/': '_', '+': '-' }[m] ?? m))
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