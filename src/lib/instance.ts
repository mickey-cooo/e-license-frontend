import axios, { AxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";

const SERVER_API_URL = process.env.API_URL;
// Browser calls stay same-origin; next.config.ts rewrites /api/v1/* to the backend (no CORS needed).
const RESOLVED_API_URL = typeof window === "undefined" ? SERVER_API_URL : "";

const AxiosInstance = axios.create({
  baseURL: RESOLVED_API_URL ?? "",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

AxiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const session = await getSession();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (session) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized - Redirecting to login...");
      if (typeof window !== "undefined") {
        // clear the NextAuth cookie too, or proxy.ts bounces /login straight back to /home
        void signOut({ callbackUrl: "/login" });
      }
    }
    return Promise.reject(error);
  },
);

export const instance = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    AxiosInstance.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    AxiosInstance.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    AxiosInstance.put<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    AxiosInstance.delete<T>(url, config),
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    AxiosInstance.patch<T>(url, data, config),
};
