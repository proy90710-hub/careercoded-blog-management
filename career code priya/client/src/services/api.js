import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const setStoredSession = ({ token, user }) => {
  localStorage.setItem("cc_token", token);
  localStorage.setItem("cc_user", JSON.stringify(user));
};

export const clearStoredSession = () => {
  localStorage.removeItem("cc_token");
  localStorage.removeItem("cc_user");
};

export const getStoredUser = () => {
  const user = localStorage.getItem("cc_user");
  return user ? JSON.parse(user) : null;
};

export default api;
