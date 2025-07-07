import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance } from "axios";

const EXPO_PUBLIC_API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://ec2-3-18-254-39.us-east-2.compute.amazonaws.com";

// Log the API URL for debugging
console.log("API URL:", EXPO_PUBLIC_API_URL);

export const API_URL: string = EXPO_PUBLIC_API_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const isAuthRoute = config.url?.startsWith("/auth");

    if (!isAuthRoute) {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
