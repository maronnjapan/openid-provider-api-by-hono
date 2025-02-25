import { PrismaClient } from "@prisma/client";
import type { Bindings } from ".."
import { PrismaD1 } from "@prisma/adapter-d1";

export const rotationKeyRoutes = async (env: Bindings) => {
    const { DB } = env;
    const adapter = new PrismaD1(DB)
    const prisma = new PrismaClient({ adapter })
    const keys = await prisma.signKey.findMany()
    return keys
}