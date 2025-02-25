import { inject } from "inversify";
import type { IKeyRepositoryInterface } from "../../../domain/key.repository.interface"
import { KeyRepositoryType } from "../../../infrastructure/types.provider";

export class GetPublicKeysUseCase {
    @inject(KeyRepositoryType.IKeyRepositoryInterface)
    private keyRepository: IKeyRepositoryInterface;

    constructor(
        keyRepository: IKeyRepositoryInterface,
    ) {
        this.keyRepository = keyRepository;
    }

    async execute(): Promise<{ keys: JsonWebKeyWithKid[] }> {
        return await this.keyRepository.exportPublicKeys()
    }
}