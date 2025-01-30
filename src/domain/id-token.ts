
export class IdToken {
    private _sub: string
    private _aud: string
    public readonly _iss: string
    public readonly _exp: number
    public readonly _iat: number
    public readonly _nonce?: string
    public readonly _auth_time?: number
    public readonly _acr?: string
    public readonly _amr?: string[]
    public readonly _azp?: string

    constructor(
        {
            sub,
            aud,
            iss,
            exp,
            iat,
            nonce,
            auth_time,
            acr,
            amr,
            azp
        }:
            {
                sub: string,
                aud: string,
                iss: string,
                exp: number,
                iat: number,
                nonce?: string,
                auth_time?: number,
                acr?: string,
                amr?: string[],
                azp?: string,
            }
    ) {
        this._sub = sub
        this._aud = aud
        this._iss = iss
        this._exp = exp
        this._iat = iat
        this._nonce = nonce
        this._auth_time = auth_time
        this._acr = acr
        this._amr = amr
        this._azp = azp
    }

    get sub() {
        return this._sub
    }

    get aud() {
        return this._aud
    }

    get iss() {
        return this._iss
    }

    get exp() {
        return this._exp
    }

    get iat() {
        return this._iat
    }

    get nonce() {
        return this._nonce
    }

    get auth_time() {
        return this._auth_time
    }

    get acr() {
        return this._acr
    }

    get amr() {
        return this._amr
    }

    get azp() {
        return this._azp
    }

    toJSONPayload() {
        return {
            sub: this.sub,
            aud: this.aud,
            iss: this.iss,
            exp: this.exp,
            iat: this.iat,
            nonce: this.nonce,
            auth_time: this.auth_time,
            acr: this.acr,
            amr: this.amr,
            azp: this.azp
        }
    }

    toJsonHeader(kid: string) {
        return {
            alg: 'RS256',
            typ: 'JWT',
            kid: kid
        } as const;
    }
}