// import axios from "axios";

// const Api = axios.create({
//   // baseURL: "http://192.168.0.192:8000/api",
//   baseURL: "http://10.183.210.129:8000/api",
//   // baseURL: "http://192.168.0.198:8000/api",
//   // baseURL: "http://10.183.210.129:8000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add request interceptor (token auto attach)
// Api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");

//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default Api;


import axios from "axios";

const Api = axios.create({
  // baseURL: "http://10.183.210.129:8000/api",
  // baseURL: "http://192.168.0.139:8000/api",
  baseURL: "http://192.168.0.189:8000/api",
  headers: { "Content-Type": "application/json" },
});

// ============ REQUEST INTERCEPTOR ============
Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ============ RESPONSE INTERCEPTOR WITH REFRESH ============
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return Api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          // "http://10.183.210.129:8000/api/admin/refresh-token",
          // "http://192.168.0.139:8000/api/admin/refresh-token",
          "http://192.168.0.189:8000/api/admin/refresh-token",
          { token: refreshToken }
        );

        const newAccess = res.data.data.accessToken;
        const newRefresh = res.data.data.refreshToken;

        localStorage.setItem("accessToken", newAccess);
        localStorage.setItem("refreshToken", newRefresh);

        Api.defaults.headers["Authorization"] = `Bearer ${newAccess}`;

        processQueue(null, newAccess);

        return Api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default Api;
