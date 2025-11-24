import axios from "axios";

const Api = axios.create({
  baseURL: "http://192.168.0.199:8000/api",
  // baseURL: "http://10.183.210.129:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 Add request interceptor (token auto attach)
Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Api;
