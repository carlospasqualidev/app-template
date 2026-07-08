import axios, { type AxiosRequestConfig } from "axios";

import { env } from "@/lib/env";
import { getSessionToken } from "@/services/session/sessionToken";

import { catchHandler, thenHandler } from "./errorHandlers";

//#region CONFIG
const axiosApi = axios.create({
  baseURL: env.EXPO_PUBLIC_API_URL,
});

// Injeta o token de sessão (expo-secure-store) no header Authorization. No web
// isso era resolvido por cookie HTTP-only; no RN o token vai explícito no header.
axiosApi.interceptors.request.use(async (config) => {
  const token = await getSessionToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosApi.interceptors.response.use(
  (response) => {
    thenHandler(response);
    return response;
  },
  (error) => {
    catchHandler(error);
    return Promise.reject(error);
  },
);
//#endregion

export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosApi.get<T>(url, config);
    return response.data;
  },

  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await axiosApi.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await axiosApi.put<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosApi.delete<T>(url, config);
    return response.data;
  },
};
