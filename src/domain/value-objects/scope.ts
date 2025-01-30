import { HTTPException } from "hono/http-exception";

export type ScopeValue = 'openid' | 'offline_access' | 'profile' | 'email' | 'phone' | 'address';
const SCOPE_VALUES: ScopeValue[] = ['openid', 'offline_access', 'profile', 'email', 'phone', 'address'];

export class Scope {
    readonly _value: ScopeValue;
    constructor(
        private readonly value: string,
    ) {
        const targetScope = SCOPE_VALUES.find(v => v === value);
        if (!Scope.isValidFormat(value) || !targetScope) {
            throw new HTTPException(422, { message: 'Invalid scope' });
        }
        this._value = targetScope;
    }

    static isValidFormat(value: string) {
        return SCOPE_VALUES.some(v => v === value);
    }
}