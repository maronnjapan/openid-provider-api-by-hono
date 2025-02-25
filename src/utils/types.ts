import type { z } from '@hono/zod-openapi'

// biome-ignore lint/suspicious/noExplicitAny: ユーティリティ型なのでanyを許容
export type toZod<T extends Record<string, any>> = {
    [K in keyof T]-?: z.ZodType<T[K]>;
};

export interface JsonWebKeyWithKid extends JsonWebKey {
    readonly kid: string;
}