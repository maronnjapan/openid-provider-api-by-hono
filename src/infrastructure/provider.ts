import { Container } from "inversify";
import { KeyRepository } from "./key.repository";
import { SignRepository } from "./sign.repository";
import type { IKeyRepositoryInterface } from "../domain/key.repository.interface";
import type { ISignRepositoryInterface } from "../domain/sign.repository.interface";
import { KeyRepositoryType, KeyValueStoreRepositoryType, SignRepositoryType } from "./types.provider";
import type { IKeyJsonValueStoreRepositoryInterface, IKeyTextValueStoreRepositoryInterface } from "../domain/key-value-store.repository.interface";
import { KeyJsonValueStoreRepository } from "./key-json-value-store.repository";
import { KeyTextValueStoreRepository } from "./key-text-value-store.repository";

const container = new Container()

container.bind<IKeyJsonValueStoreRepositoryInterface>(KeyValueStoreRepositoryType.IKeyJsonValueStoreRepositoryInterface).to(KeyJsonValueStoreRepository)
container.bind<IKeyTextValueStoreRepositoryInterface>(KeyValueStoreRepositoryType.IKeyTextValueStoreRepositoryInterface).to(KeyTextValueStoreRepository)

container.bind<ISignRepositoryInterface>(SignRepositoryType.ISignRepositoryInterface).to(SignRepository)

container.bind<IKeyRepositoryInterface>(KeyRepositoryType.IKeyRepositoryInterface).to(KeyRepository)
export { container };