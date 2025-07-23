import axios from "axios";

const instance = axios.create({
  baseURL: "https://dailyquizapi-dev.azurewebsites.net",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  const apikey =
    "XsbsjyBdkB#gv!z05jQ4#gYPUeq@87DQKfTjVb^BPtzA1ak#YTu8p%C3q1kBqCU7";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["API-KEY"] = apikey;
  return config;
});

export default instance;
