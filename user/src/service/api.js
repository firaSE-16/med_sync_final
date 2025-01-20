import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:7001/api", // Replace with your backend's base URL
  withCredentials: true, // Enables cookies for cross-origin requests
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to the request header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized, redirecting to login...");
      window.location.href = "/login"; // Redirect to login page if 401
    }
    return Promise.reject(error);
  }
);

// Signup Function
export const signupUser = async (fullName, email, password) => {
  try {
    const response = await api.post("/user/signup", { fullName, email, password });
    console.log("Signup successful:", response.data);
    return response.data; // Return response data to the caller
  } catch (error) {
    console.error("Signup failed:", error.response?.data?.message);
    throw error; // Rethrow error for the caller to handle
  }
};

// Login Function
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    console.log("Login successful:", response.data);

    // Store auth token in localStorage
    localStorage.setItem("authToken", response.data.token);

    return response.data; // Return response data to the caller
  } catch (error) {
    console.error("Login failed:", error.response?.data?.message);
    throw error; // Rethrow error for the caller to handle
  }
};

export default api;
