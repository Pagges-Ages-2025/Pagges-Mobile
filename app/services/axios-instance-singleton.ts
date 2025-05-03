import axios, { AxiosInstance } from "axios";

// .env file
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!EXPO_PUBLIC_API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not defined");
}

export const API_URL: string = EXPO_PUBLIC_API_URL;

// Create a singleton Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout request
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
