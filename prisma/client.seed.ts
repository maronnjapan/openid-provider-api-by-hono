import type { PrismaClient } from "@prisma/client";

export const clientSeedMain = async (prisma: PrismaClient) => {
    await prisma.client.create({
        data: {
            clientId: 'd654d2fc-118b-8592-020a-f5b13c4eafbe',
            clientSecret: 'clientSecret',
            name: 'clientName',
            allowRedirectUrls: {
                createMany: {
                    data: [{ url: 'http://localhost:3000' }]
                }
            },
            allowScopes: {
                createMany: {
                    data: [{ name: 'openid' }, { name: 'profile' }, { name: 'email' }, { name: 'address' }, { name: 'phone' }]
                }
            }
        }
    })
}