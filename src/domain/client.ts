import { HTTPException } from "hono/http-exception";
import { Scope } from "./value-objects/scope";
import { Url } from "./value-objects/url";

export class Client {

    readonly _client_id: string
    readonly _client_secret: string
    readonly _client_name: string
    _redirect_uris: Url[] = []
    _scope: Scope[] = []
    constructor(
        {
            client_id,
            client_name,
            client_secret,
            redirect_uris,
            scope
        }: {
            client_id: string,
            client_secret: string,
            client_name: string,
            redirect_uris: string[],
            scope: string,
        }
    ) {
        this._client_id = client_id
        this._client_secret = client_secret
        this._client_name = client_name

        this._redirect_uris = redirect_uris.map(uri => new Url(uri))
        this._scope = scope.split(' ').map(s => new Scope(s))
    }

    splitScopes(scopeString: string) {
        const scopes = scopeString.split(' ')
        if (!scopes.every(s => Scope.isValidFormat(s))) {
            throw new HTTPException(422, { message: 'Invalid scope' })
        }

        return scopes.map(s => new Scope(s))

    }
}