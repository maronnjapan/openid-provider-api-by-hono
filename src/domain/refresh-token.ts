export class RefreshToken {
    constructor(
        public readonly refresh_token: string,
        public readonly token_type: 'Bearer',
        public readonly expires_in: number,
    ) { }
}