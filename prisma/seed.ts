import { PrismaClient } from "@prisma/client"
import { clientSeedMain } from "./client.seed"

const prisma = new PrismaClient()
const main = async () => {
    await clientSeedMain(prisma)
}

main().then(() => {
    console.log('seed success')
}).catch((e) => {
    console.error(e)
}).finally(async () => {
    await prisma.$disconnect()
})