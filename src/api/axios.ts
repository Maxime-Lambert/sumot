import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { showToast } from "@/services/ToastService";

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
interface ProblemDetails {
  title: string;
  status: number;
  detail: string;
  instance: string;
}

const API_URL = "https://dailyquizapi.azurewebsites.net";
const ACCESS_KEY = "access_token";
const EXP_KEY = "token_expires";

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

function isTokenExpiringSoon(): boolean {
  const exp = localStorage.getItem(EXP_KEY);
  if (!exp) return true;
  return parseInt(exp, 10) - Date.now() < 60_000;
}

async function refreshAccessToken(): Promise<string> {
  const { data } = await axios.post<{ token: string }>(
    `${API_URL}/users/refresh`,
    {},
    { withCredentials: true }
  );

  localStorage.setItem(ACCESS_KEY, data.token);
  localStorage.setItem(EXP_KEY, (Date.now() + 60 * 60 * 1000).toString());
  return data.token;
}

export const instance: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (config.url?.includes("/users/refresh")) return config;

    if (token) {
      if (isTokenExpiringSoon()) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const newToken = await refreshAccessToken();
            onRefreshed(newToken);
          } catch {
            window.location.href = "/logout";
            throw new Error("Session expirée");
          } finally {
            isRefreshing = false;
          }
        }

        const newToken = await new Promise<string>((resolve) => {
          subscribeTokenRefresh(resolve);
        });
        config.headers.Authorization = `Bearer ${newToken}`;
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    config.headers["X-Client-Type"] = "SPA";
    return config;
  }
);

instance.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (originalRequest?.url?.includes("/users/logout")) {
      return Promise.reject(error);
    }
    const problem = error.response?.data as ProblemDetails;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !(originalRequest as RetryAxiosRequestConfig)._retry
    ) {
      (originalRequest as RetryAxiosRequestConfig)._retry = true;

      try {
        await refreshAccessToken();
        return instance(originalRequest);
      } catch {
        window.location.href = "/logout";
      }
    }

    showToast(problem.detail || "Une erreur est survenue", "error");
    return Promise.reject(error);
  }
);

export default instance;
