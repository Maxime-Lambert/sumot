import { showToast } from "@/services/ToastService";
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { useNavigate } from "react-router-dom";

const instance: AxiosInstance = axios.create({
  baseURL: "https://dailyquizapi.azurewebsites.net",
  withCredentials: true,
});
interface RefreshResponse {
  accessToken: string;
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
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

        const newAccessToken = data.accessToken;
        localStorage.setItem("access_token", newAccessToken);

        onRefreshed(newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return instance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        const navigate = useNavigate();
        navigate("/login");
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
