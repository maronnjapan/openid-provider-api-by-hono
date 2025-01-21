import crypto from 'node:crypto'
import { v4 as uuidv4 } from 'uuid'
import type { IKeyRepositoryInterface } from '../domain/key.repository.interface';
import { injectable } from 'inversify';

@injectable()
export class KeyRepository implements IKeyRepositoryInterface {
    readonly _kid: string

    constructor(kid?: string) {
        this._kid = kid ?? uuidv4()
    }

    async generateSignKeys() {
        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //     modulusLength: 2048,
        //     publicKeyEncoding: {
        //         type: 'spki',
        //         format: 'pem'
        //     },
        //     privateKeyEncoding: {
        //         type: 'pkcs8',
        //         format: 'pem'
        //     }
        // });

        const keyPair = await crypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: 'SHA-256'
            },
            true,
            ['encrypt', 'decrypt']
        );

        const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
        const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

        return {
            kid: this._kid,
            privateKey: Buffer.from(privateKey).toString('base64'),
            publicKey: Buffer.from(publicKey).toString('base64')
        }
    }
}