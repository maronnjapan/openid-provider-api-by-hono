import { injectable } from "inversify";
import type { ISignRepositoryInterface, TokenHeader } from "../domain/sign.repository.interface";
import jwt from 'jsonwebtoken'


@injectable()
export class SignRepository implements ISignRepositoryInterface {
    sign(payload: Record<string, unknown>, header: TokenHeader, secret_key: string) {
        return jwt.sign(payload, secret_key, { header, algorithm: header.alg, keyid: header.kid })
    }
}