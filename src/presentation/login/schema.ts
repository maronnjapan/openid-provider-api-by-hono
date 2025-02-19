import { z } from '@hono/zod-openapi'

export const loginRequestSchema = z.object({
    email: z.string().email().openapi({ title: 'メールアドレス', description: 'ユーザーのメールアドレス' }),
    password: z.string().min(6).openapi({ title: 'パスワード', description: 'ユーザーのパスワード' }),
})
export type LoginRequestType = z.infer<typeof loginRequestSchema>

export const loginResponseSchema = z.object({
    userId: z.string().openapi({ title: 'ユーザーID' }),
})
export type LoginResponseType = z.infer<typeof loginResponseSchema>
