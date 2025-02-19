import { hashSha256 } from "../utils/hash";

export class User {
    constructor(
        public readonly email: string,
        private readonly password: string,
    ) { }

    async getHashedPassword() {
        return hashSha256(this.password)
    }

    async isEqualsPassword(password: string) {
        console.log(await this.getHashedPassword())
        console.log(password)
        return (await this.getHashedPassword()) === password
    }
}