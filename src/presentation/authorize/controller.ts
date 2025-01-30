import type app from "../..";
import type { Container } from "inversify";

import { authorizeRouter } from "./router";
import type { GenerateAuthorizeCodeUseCase } from "../../application/usecase/generate-authorize-code/usecase";
import { GenerateAuthorizeCodeType } from "../../application/usecase/generate-authorize-code/types";
import type { AuthorizeParamSchemaType } from "./schema";
import { convertRequestToGenerateAuthorizationCodeInput } from "./mapper/convert-request-to-usecase-input";
import { setCookie } from "hono/cookie";

export const authorizeRoutes = (baseApp: typeof app, container: Container) => {

    baseApp.openapi(authorizeRouter, async (c) => {
        const usecase = container.get<GenerateAuthorizeCodeUseCase>(GenerateAuthorizeCodeType.GenerateAuthorizeCode)
        const body = await c.req.json() as AuthorizeParamSchemaType;
        const { code, state, redirectUri } = await usecase.execute(convertRequestToGenerateAuthorizationCodeInput(body))

        return c.json({ code, state, redirect_uri: redirectUri }, 200, {
            'Content-Type': 'application/json',
        })
    })
}
