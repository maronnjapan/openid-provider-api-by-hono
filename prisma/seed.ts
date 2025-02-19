import { PrismaClient } from "@prisma/client"
import { clientSeedMain } from "./client.seed"
import { userSeedMain } from "./user.seed"

const prisma = new PrismaClient()
const main = async () => {
    await clientSeedMain(prisma)
    await userSeedMain(prisma)
}

main().then(() => {
    console.log('seed success')
}).catch((e) => {
    console.error(e)
}).finally(async () => {
    await prisma.$disconnect()
})