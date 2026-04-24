import axios, { AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

const SERVER_API_URL = process.env.API_URL;
const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL;
const RESOLVED_API_URL =
  typeof window === "undefined" ? SERVER_API_URL : CLIENT_API_URL;

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
        window.location.href = "/sign-in";
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
