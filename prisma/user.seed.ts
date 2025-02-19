import type { PrismaClient } from "@prisma/client"
import { hashSha256 } from "../src/utils/hash"

export const userSeedMain = async (prisma: PrismaClient) => {
    const password = await hashSha256('password')
    await prisma.user.create({
        data: {
            name: 'test@example.com',
            password,
        }
    })
}