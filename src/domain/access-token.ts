import type { Scope } from "./value-objects/scope"

export class AccessToken {
    _exp: number
    constructor(
        public readonly tokenType: 'Bearer',
        public readonly expiresIn: number,
        private readonly scopes: Scope[],
        public readonly generatedTime = Date.now(),
    ) {
        this._exp = this.generatedTime + this.expiresIn
    }

    get isExpired(): boolean {
        return this.generatedTime + this.expiresIn < Date.now()
    }

    generateHeader(kid: string) {
        const header = {
            alg: 'RS256',
            typ: 'JWT',
            kid
        } as const
        return header;
    }

    generatePayload() {
        return {
            scopes: this.scopes.map(s => s._value),
            exp: this._exp
        }
    }
}