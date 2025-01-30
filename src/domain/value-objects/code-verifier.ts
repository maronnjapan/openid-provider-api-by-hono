import { HTTPException } from "hono/http-exception";

export class CodeVerifier {
    constructor(
        public readonly value: string,
    ) {

        const decoded = decodeURIComponent(value);
        if (!this.isValidFormat(decoded)) {
            throw new HTTPException(422, { message: 'Invalid code_verifier' });
        }
        this.value = decoded;
    }

    private isValidFormat(value: string): boolean {
        // RFC 7636で定義される文字セットチェック
        return /^[A-Za-z0-9-._~%]{43,128}$/.test(value);
    }
}