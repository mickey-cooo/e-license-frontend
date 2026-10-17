/**
 * An array of routes that are accessible without authentication
 * These routes will not be protected by the auth middleware
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/home",
  "/forgot-password",
  "/reset-password",
];

/**
 * An array of routes that are used for  authentication
 * These routes will redirect to the home
 */
export const authRoutes = ["/login", "/register"];

/**
 * prefix for API routes that handle authentication
 * /api/auth/sign-in, /api/auth/register, etc.
 * These routes should not be protected
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * prefix for backend API calls proxied by next.config.ts rewrites;
 * the backend enforces its own auth (bearer token), so the page guard skips them
 */
export const apiProxyPrefix = "/api/v1";

/**
 * Default redirect after successful login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/home";
