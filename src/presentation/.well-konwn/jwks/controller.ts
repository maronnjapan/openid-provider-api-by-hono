import type { Container } from 'inversify'
import type app from '../../..'
import { jwksRouter } from './router'
import { GetPublicKeysUseCaseType } from '../../../application/usecase/get-public-keys/type'
import type { GetPublicKeysUseCase } from '../../../application/usecase/get-public-keys/usecase'
import type { AppType } from '../../..'

export const jwksRoutes = (baseApp: AppType, container: Container) => {
    baseApp.openapi(jwksRouter, async (c) => {
        const getPublicKeysUseCase = container.get<GetPublicKeysUseCase>(GetPublicKeysUseCaseType.GetPublicKeysUseCase)
        const keys = await getPublicKeysUseCase.execute()
        return c.json(keys, 200, {
            'Content-Type': 'application/json'
        })
    })
}