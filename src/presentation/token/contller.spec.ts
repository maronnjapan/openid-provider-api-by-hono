import { describe, it } from "vitest";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

describe('/oauth/token', () => {
    it('認可コードとCodeVerifierが適切であれば、アクセストークンを返すこと')
    it('認可コードが不正であれば、Unauthorizedエラーを返すこと')
    it('CodeVerifierが不正であれば、Unauthorizedエラーを返すこと')
    describe('クライアント認証が完了していない場合', () => {
        it('clientIdとredirectUriが存在しない場合、BadRequestエラーを返すこと')
        it('clientIdが不正なであれば、Unauthorizedエラーを返すこと')
        it('redirectUriが不正なであれば、Unauthorizedエラーを返すこと')
    })
})