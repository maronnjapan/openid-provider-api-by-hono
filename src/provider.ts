import { Container } from "inversify"
import type { IKeyJsonValueStoreRepositoryInterface, IKeyTextValueStoreRepositoryInterface } from "./domain/key-value-store.repository.interface"
import { KeyRepositoryType, KeyValueStoreRepositoryType, SignRepositoryType } from "./infrastructure/types.provider"
import { KeyJsonValueStoreRepository } from "./infrastructure/key-json-value-store.repository"
import { KeyTextValueStoreRepository } from "./infrastructure/key-text-value-store.repository"
import type { ISignRepositoryInterface } from "./domain/sign.repository.interface"
import { SignRepository } from "./infrastructure/sign.repository"
import type { IKeyRepositoryInterface } from "./domain/key.repository.interface"
import { KeyRepository } from "./infrastructure/key.repository"
import { CreateTokenUseCase } from "./application/usecase/create-token/usecase"
import { CreateTokenType } from "./application/usecase/create-token/types"
import { GenerateAuthorizeCodeType } from "./application/usecase/generate-authorize-code/types"
import { GenerateAuthorizeCodeUseCase } from "./application/usecase/generate-authorize-code/usecase"
import { LoginUseCase } from "./application/usecase/login/usecase"
import { LoginType } from "./application/usecase/login/types"

const container = new Container()

// infrastructureのBind
container.bind<IKeyJsonValueStoreRepositoryInterface>(KeyValueStoreRepositoryType.IKeyJsonValueStoreRepositoryInterface).to(KeyJsonValueStoreRepository)
container.bind<IKeyTextValueStoreRepositoryInterface>(KeyValueStoreRepositoryType.IKeyTextValueStoreRepositoryInterface).to(KeyTextValueStoreRepository)
container.bind<ISignRepositoryInterface>(SignRepositoryType.ISignRepositoryInterface).to(SignRepository)
container.bind<IKeyRepositoryInterface>(KeyRepositoryType.IKeyRepositoryInterface).to(KeyRepository)

// applicationのBind
container.bind<CreateTokenUseCase>(CreateTokenType.CreateTokenUseCase).to(CreateTokenUseCase)
container.bind<GenerateAuthorizeCodeUseCase>(GenerateAuthorizeCodeType.GenerateAuthorizeCode).to(GenerateAuthorizeCodeUseCase)
container.bind<LoginUseCase>(LoginType.LoginUseCase).to(LoginUseCase)

console.dir(container, { depth: null })
export { container };