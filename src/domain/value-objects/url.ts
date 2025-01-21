import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'

export class Url {
    constructor(
        public readonly url: string,
    ) {
        const isValidUrl = z.string().url().safeParse(this.url)
        if (!isValidUrl.success) {
            throw new HTTPException(422, { message: 'Invalid URL' })
        }
    }
}