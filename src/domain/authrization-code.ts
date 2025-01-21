import { z } from "@hono/zod-openapi"
import { v4 as uuidv4 } from 'uuid';
import { HTTPException } from "hono/http-exception"
export class AuthorizationCode {
    constructor(
        public readonly value: string,
    ) {
        if (!this.isValidFormat(this.value)) {
            throw new HTTPException(422, { message: 'Invalid code' })
        }
    }

    private isValidFormat(value: string) {
        return z.string().uuid().safeParse(value).success
    }

    static from(value: string) {
        return new AuthorizationCode(value);
    }

    static generate() {
        return new AuthorizationCode(uuidv4())
    }
}