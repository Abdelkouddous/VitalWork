import axios from "axios";

const customFetch = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

// Automatically attach JWT token from localStorage if available
customFetch.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default customFetch;
