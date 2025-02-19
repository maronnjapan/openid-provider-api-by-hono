export type LoginInfo = {
    user_id: string;
}

export type LoginRequest = {
    email: string;
    password: string;
}

export const LoginType = {
    LoginUseCase: Symbol.for('LoginUseCase')
}