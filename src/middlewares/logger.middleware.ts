import type { Context } from "hono";

export const customLogger = (message: string, ...rest: string[]) => {
    console.log(message, ...rest)
}
export const loggerMiddleware = async (context: Context, next: () => Promise<void>) => {
    const requestId = context.get('requestId')
    const requestUrl = context.req.url
    const requestMethod = context.req.method
    const requestBody = context.req.parseBody()
    const requestQuery = context.req.queries()

    await next()


    const cloneResponse = context.res.clone()
    const responseStatus = cloneResponse.status
    const responseHeaders = cloneResponse.headers
    const responseData = await cloneResponse.text()
    const responseStatusText = cloneResponse.statusText

    const showJson = {
        requestId,
        requestUrl,
        requestMethod,
        requestBody,
        requestQuery,
        responseStatus,
        responseHeaders,
        responseData: isValidJSON(responseData) ? JSON.parse(responseData) : responseData,
        responseStatusText

    }
    customLogger(JSON.stringify(showJson))

}

function isValidJSON(str: string): boolean {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}