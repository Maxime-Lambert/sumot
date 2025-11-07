import { showToast } from "@/services/ToastService";
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const instance: AxiosInstance = axios.create({
  baseURL: "https://dailyquizapi.azurewebsites.net",
  withCredentials: true,
});

interface RefreshResponse {
  token: string;
}

interface ProblemDetails {
  title: string;
  status: number;
  detail: string;
  instance: string;
}

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

instance.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    const token = localStorage.getItem("access_token");
    const expires = localStorage.getItem("token_expires");

    if (config.url?.includes("/users/refresh")) {
      config.headers.Authorization = token ? `Bearer ${token}` : "";
      config.headers["X-Client-Type"] = "SPA";
      return config;
    }

    if (token && expires) {
      const expiresAt = parseInt(expires, 10);
      const now = Date.now();

      if (expiresAt - now < 60 * 1000) {
        console.log("Refreshing token before request...");

        try {
          const { data } = await instance.post<RefreshResponse>(
            "/users/refresh",
            {},
            { withCredentials: true }
          );

          localStorage.setItem("access_token", data.token);
          localStorage.setItem(
            "token_expires",
            (Date.now() + 60 * 60 * 1000).toString()
          );

          config.headers.Authorization = `Bearer ${data.token}`;
        } catch (err) {
          console.log("raté donc logout", err);
          window.location.href = "/logout";
          throw err;
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    config.headers["X-Client-Type"] = "SPA";
    return config;
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<AxiosResponse | never> => {
    const problem = error.response?.data as ProblemDetails;
    const originalRequest = error.config as RetryAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(instance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<RefreshResponse>(
          "https://dailyquizapi.azurewebsites.net/users/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.token;
        localStorage.setItem("access_token", newAccessToken);
        localStorage.setItem(
          "token_expires",
          (Date.now() + 60 * 60 * 1000).toString()
        );
        onRefreshed(newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return instance(originalRequest);
      } catch (refreshError) {
        window.location.href = "/logout";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else {
      showToast(problem?.detail || "Une erreur est survenue", "error");
    }

    return Promise.reject(error);
  }
);

export default instance;
