import type { CodeVerifier } from "./code-verifier";

// FIXME: 等値比較ができる汎用的なクラスを作成し、それを継承して使用する
export class CodeChallenge {
    private readonly value: string;
    private readonly method: "S256" | "plain";

    constructor(value: string, method: "S256" | "plain") {
        this.value = decodeURIComponent(value);
        this.method = method;
    }

    equals(other: CodeChallenge) {
        if (other === this) {
            return true;
        }
        if (!(other instanceof CodeChallenge)) {
            return false;
        }
        return this.value === other.value && this.method === other.method;
    }

    static async fromVerifier(verifier: CodeVerifier, method: "S256" | "plain") {
        const value = method === "S256"
            ? await CodeChallenge.calculateS256(verifier)
            : verifier.value
        return new CodeChallenge(value, method);
    }

    private static async calculateS256(verifier: CodeVerifier) {
        const hashBuffer = await CodeChallenge.generateHashBuffer(verifier.value);
        return CodeChallenge.bufferToBase64UrlEncoded(hashBuffer);
    }


    private static bufferToBase64UrlEncoded(input: ArrayBuffer) {
        const ie11SafeInput = new Uint8Array(input);
        return CodeChallenge.encodeBase64(
            btoa(String.fromCharCode(...Array.from(ie11SafeInput)))
        );
    };

    private static encodeBase64(input: string) {
        const b64Chars: { [index: string]: string } = { '+': '-', '/': '_', '=': '' };
        return input.replace(/[+/=]/g, (m: string) => b64Chars[m]);
    }

    private static async generateHashBuffer(codeVerifier: string) {
        return await crypto.subtle.digest(
            { name: 'SHA-256' },
            new TextEncoder().encode(codeVerifier)
        )
    };

    toString() {
        return this.value;
    }
}