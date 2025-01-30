import { v4 as uuidv4 } from 'uuid'
import type { IKeyRepositoryInterface } from '../domain/key.repository.interface';
import { injectable } from 'inversify';
import { HTTPException } from 'hono/http-exception';

@injectable()
export class KeyRepository implements IKeyRepositoryInterface {
    readonly _kid: string

    constructor(kid?: string) {
        this._kid = kid ?? uuidv4()
    }

    async generateSignKeys() {

        const keyPair = await crypto.subtle.generateKey(
            {
                name: 'RSASSA-PKCS1-v1_5',
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]).buffer,
                hash: 'SHA-256'
            },
            true,
            ['sign', 'verify']
        );

        if (keyPair instanceof CryptoKey) {
            throw new HTTPException(500, { message: 'Failed to generate key pair' })
        }

        // const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
        // const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
        // if (!(publicKey instanceof ArrayBuffer) || !(privateKey instanceof ArrayBuffer)) {
        //     throw new HTTPException(500, { message: 'Failed to export key' })
        // }

        return {
            kid: this._kid,
            ...keyPair,
        }
    }
}