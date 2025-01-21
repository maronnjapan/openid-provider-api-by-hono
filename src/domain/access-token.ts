import type { Scope } from "./value-objects/scope"

export class AccessToken {
    _exp: number
    constructor(
        public readonly token_type: 'Bearer',
        public readonly expires_in: number,
        private readonly secret_key: string,
        private readonly scopes: Scope[],
        public readonly generated_time = Date.now(),
    ) {
        this._exp = this.generated_time + this.expires_in
    }

    get isExpired(): boolean {
        return this.generated_time + this.expires_in < Date.now()
    }

    generateHeader(kid: string) {
        return {
            alg: 'RS256',
            typ: 'JWT',
            kid
        }
    }

    generatePayload() {
        return {
            scopes: this.scopes.map(s => s.value),
            exp: this._exp
        }
    }
}