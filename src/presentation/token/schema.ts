import { z } from '@hono/zod-openapi'
export const CreateTokenParamSchema = z.object({
    client_id: z.string().optional().openapi({ title: 'クライアントID', description: 'Publicクライアントからのリクエスト時は必須' }),
    redirect_uri: z.string().optional().openapi({ title: 'リダイレクトURI', description: 'Publicクライアントからのリクエスト時は必須' }),
    grant_type: z.enum(['authorization_code', 'refresh_token']).openapi({ title: '認可タイプ', description: 'authorization_code: 認可コード取得, refresh_token: リフレッシュトークン取得' }),
    code: z.string().openapi({ title: '認可コード' }),
    code_verifier: z.string().openapi({ title: '認可コードベリファイア', description: '仕様書では推奨だが、セキュリティを考え必須とする' }),
})
export type CreateTokenParamType = z.infer<typeof CreateTokenParamSchema>
export const CreateTokenResponseSchema = z.object({
    access_token: z.string().openapi({ title: 'アクセストークン' }),
    token_type: z.enum(['Bearer']).openapi({ title: 'トークンタイプ' }),
    expires_in: z.number().openapi({ title: '有効期限' }),
    refresh_token: z.string().optional().openapi({ title: 'リフレッシュトークン', description: 'リフレッシュトークンの要求もあった時のみ返却する' }),
    id_token: z.string().openapi({ title: 'IDトークン' }),
})