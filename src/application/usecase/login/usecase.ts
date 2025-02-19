import { inject } from "inversify";
import type { LoginRequest } from "./types";
import { PrismaClientType } from "../../../infrastructure/prisma";
import type { PrismaClient } from "@prisma/client";
import { HTTPException } from "hono/http-exception";
import { hashSha256 } from "../../../utils/hash";

export class LoginUseCase {
    @inject(PrismaClientType.PrismaClient)
    private readonly prisma: PrismaClient;

    constructor(
        prisma: PrismaClient,
    ) {
        this.prisma = prisma;
    }
    async execute(request: LoginRequest) {

        const user = await this.prisma.user.findFirst({ where: { name: request.email } })
        if (!user) {
            throw new HTTPException(401, { message: 'Unauthorized user' });
        }

        const hashedPassword = await hashSha256(request.password)
        if (user.password !== hashedPassword) {
            throw new HTTPException(401, { message: 'Unauthorized user' });
        }

        return { userId: user.id }
    }
}