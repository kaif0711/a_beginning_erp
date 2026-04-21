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
import { mockData } from "../mockData";

/**
 * NOTE: This is a FRONTEND-ONLY DEMO version of the API client.
 * The real backend integration has been bypassed.
 * To re-enable, remove the mock logic and uncomment the original configuration.
 */

const Api = axios.create({
  baseURL: "/api-demo", // Dummy base URL
  headers: { "Content-Type": "application/json" },
});

// SIMULATE API DELAY (800ms)
const simulateDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

// ============ MOCK INTERCEPTOR ============
Api.interceptors.request.use(
  async (config) => {
    // We intercept ALL requests and return a mock response
    // instead of letting axios actually make the network call.
    
    await simulateDelay();

    const url = config.url;
    const method = config.method ? config.method.toUpperCase() : "GET";

    // MOCK RESPONSE BUILDER
    let responseData = { data: {}, status: 200, message: "Success" };

    try {
      // 1. AUTHENTICATION
      if (url.includes("/admin/login")) {
        responseData = {
          data: {
            data: {
              accessToken: "mock-access-token-12345",
              refreshToken: "mock-refresh-token-12345",
              admin: { username: "demo_admin" }
            }
          },
          status: 200
        };
      }
      
      // 2. DASHBOARD
      else if (url.includes("/dashboard")) {
        responseData = { data: { data: mockData.dashboard }, status: 200 };
      }

      // 3. STUDENTS
      else if (url.includes("/student/list") || url.includes("/student/search")) {
        responseData = { data: { data: mockData.students }, status: 200 };
      }

      // 4. COURSES
      else if (url.includes("/course/list") || url.includes("/course/search")) {
        responseData = { data: { data: mockData.courses }, status: 200 };
      }

      // 5. FEES
      else if (url.includes("/fees/list") || url.includes("/fees/search")) {
        responseData = { data: { data: mockData.fees }, status: 200 };
      }

      // 6. INTERNSHIPS
      else if (url.includes("/intershipletter/list") || url.includes("/intershipletter/search")) {
        responseData = { data: { data: mockData.internships }, status: 200 };
      }

      // 7. CERTIFICATES
      else if (url.includes("/certificate/list") || url.includes("/certificate/search")) {
        responseData = { data: { data: mockData.certificates }, status: 200 };
      }

      // 8. LEAVE STUDENTS
      else if (url.includes("/leave-student/list") || url.includes("/leave-student/search")) {
        responseData = { data: { data: mockData.leaves }, status: 200 };
      }

      // 9. GENERIC SUCCESS FOR MUTATIONS (POST/PUT/DELETE)
      else if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
        responseData = { 
          data: { 
            message: "Action performed successfully (Demo Mode)", 
            success: true 
          }, 
          status: 200 
        };
      }

    } catch (err) {
      console.error("Mock API Error:", err);
      // We still return a 200 for demo purposes often, but here we can simulate error
      return Promise.reject({ response: { status: 500, data: { message: "Mock API Error" } } });
    }

    // Return the mock response in the format axios expects
    // We "reject" it so it doesn't go to the network, but we catch it in the response interceptor
    return Promise.reject({
      config,
      response: {
        ...responseData,
        config,
        headers: {},
      }
    });
  },
  (error) => Promise.reject(error)
);

// Catch the "rejected" promise which actually contains our mock response
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 200) {
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  }
);

export default Api;
