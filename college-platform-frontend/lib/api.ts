import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://backend-api-production-1d0f.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAuthHeaders = () => {
  if (typeof window === "undefined") {
    return {};
  }

  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
