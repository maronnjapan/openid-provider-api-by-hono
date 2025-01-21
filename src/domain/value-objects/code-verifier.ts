import { HTTPException } from "hono/http-exception";

export class CodeVerifier {
    constructor(
        public readonly value: string,
    ) {
        if (!this.isValidFormat(value)) {
            throw new HTTPException(422, { message: 'Invalid code_verifier' });
        }
        this.value = value;
    }

    private isValidFormat(value: string): boolean {
        // RFC 7636で定義される文字セットチェック
        return /^[A-Za-z0-9-._~]{43,128}$/.test(value);
    }
}