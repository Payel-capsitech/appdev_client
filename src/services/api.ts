// import axios from "axios";

// const API = axios.create({
//   baseURL: "https://localhost:7238/api",
// });

// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("authToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default API;

// src/api/useApi.ts
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const useApi = () => {
  const { token } = useAuth();

  const instance = axios.create({
    baseURL: "https://localhost:7238/api",
  });

  instance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

export default useApi;