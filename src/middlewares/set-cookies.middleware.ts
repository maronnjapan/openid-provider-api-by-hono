import type { Context } from "hono";
import { getCookie } from "hono/cookie";

export const AUTH_INFO_COOKIE_NAME = 'auth_info';

const cookieNames = [AUTH_INFO_COOKIE_NAME] as const;
type CookieMapKey = typeof cookieNames[number];

export const setCookiesMiddleware = async (context: Context, next: () => Promise<void>) => {
    const cookiesMap = new Map<CookieMapKey, string | undefined>();
    const cookies = getCookie(context);
    for (const cookieName of cookieNames) {
        cookiesMap.set(cookieName, cookies[cookieName] && cookies[cookieName] !== '' ? cookies[cookieName] : undefined);
    }
    context.set('cookies', cookiesMap);
    await next();
};

declare module 'hono' {
    interface ContextVariableMap {
        cookies: Map<CookieMapKey, string | undefined>
    }
}