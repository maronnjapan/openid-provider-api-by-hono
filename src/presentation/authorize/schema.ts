import { z } from '@hono/zod-openapi'
export const AuthorizeParamSchema = z.object({
    client_id: z.string().openapi({ title: 'クライアントID' }),
    redirect_uri: z.string().optional().openapi({ title: 'リダイレクトURI', description: 'Publicクライアントからのリクエスト時は必須' }),
    grant_type: z.enum(['authorization_code', 'refresh_token']).openapi({ title: '認可タイプ', description: 'authorization_code: 認可コード取得, refresh_token: リフレッシュトークン取得' }),
    state: z.string().openapi({ title: 'ステート', description: 'CSRF対策' }),
    scope: z.string().openapi({ title: 'スコープ', description: 'アクセス権限' }),
    response_type: z.enum(['code']).openapi({ title: 'レスポンスタイプ', description: 'code: 認可コード, token: アクセストークン, id_token: IDトークン' }),
    nonce: z.string().optional().openapi({ title: 'ナンス', description: 'IDトークンの検証に使用' }),
    code_challenge_method: z.enum(['plain', 'S256']).openapi({ title: '認可コードベリファイアメソッド', description: '仕様書では推奨だが、セキュリティを考え必須とする' }),
    code_challenge: z.string().openapi({ title: '認可コードベリファイア', description: '仕様書では推奨だが、セキュリティを考え必須とする' }),
})
export type AuthorizeParamSchemaType = z.infer<typeof AuthorizeParamSchema>
export const AuthorizeResponseSchema = z.object({
    state: z.string().openapi({ title: 'ステート', description: 'CSRF対策' }),
    code: z.string().openapi({ title: '認可コード', description: 'アクセストークン取得に使用' }),
    redirect_uri: z.string().openapi({ title: 'リダイレクトURI', description: '認可コードを送信するURI' }),
})