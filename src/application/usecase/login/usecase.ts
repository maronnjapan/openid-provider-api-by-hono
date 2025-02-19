import { inject } from "inversify";
import type { LoginRequest } from "./types";
import { PrismaClientType } from "../../../infrastructure/prisma";
import type { PrismaClient } from "@prisma/client";
import { HTTPException } from "hono/http-exception";
import { hashSha256 } from "../../../utils/hash";
import { User } from "../../../domain/user";

export class LoginUseCase {
    @inject(PrismaClientType.PrismaClient)
    private readonly prisma: PrismaClient;

    constructor(
        prisma: PrismaClient,
    ) {
        this.prisma = prisma;
    }
    async execute(request: LoginRequest) {

        const data = await this.prisma.user.findFirst({ where: { email: request.email } })
        if (!data) {
            throw new HTTPException(401, { message: 'Unauthorized user' });
        }

        const user = new User(request.email, request.password)

        const isPasswordEqual = await user.isEqualsPassword(data.password)


        if (!isPasswordEqual) {
            throw new HTTPException(401, { message: 'Unauthorized user' });
        }

        return { userId: data.id }
    }
}