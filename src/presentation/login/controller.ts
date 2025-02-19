import type { Container } from "inversify";
import type app from "../..";
import { loginRouter } from "./router";
import type { LoginRequestType } from "./schema";
import type { LoginUseCase } from "../../application/usecase/login/usecase";
import { LoginType } from "../../application/usecase/login/types";

export const loginRoute = (baseApp: typeof app, container: Container) => {
    baseApp.openapi(loginRouter, async (c) => {

        const loginUseCase = container.get<LoginUseCase>(LoginType.LoginUseCase)

        const body = await c.req.json() as LoginRequestType;

        const user = await loginUseCase.execute({ email: body.email, password: body.password })

        return c.json({ userId: user.userId }, 200, {
            'Content-Type': 'application/json',
        })
    })
}