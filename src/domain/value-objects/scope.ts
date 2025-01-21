import { HTTPException } from "hono/http-exception";

export type ScopeValue = 'openid' | 'offline_access' | 'profile' | 'email' | 'phone' | 'address';
const SCOPE_VALUES: ScopeValue[] = ['openid', 'offline_access', 'profile', 'email', 'phone', 'address'];

export class Scope {
    constructor(
        public readonly value: string,
    ) {
        if (!Scope.isValidFormat(value)) {
            throw new HTTPException(422, { message: 'Invalid scope' });
        }
        this.value = value;
    }

    static isValidFormat(value: string) {
        return SCOPE_VALUES.some(v => v === value);
    }
}