import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5500/api",
  withCredentials: false,
});
api.interceptors.request.use(
  (config) => {
    const isAdminRoute = config.url?.includes('/admin') || config.url?.startsWith('/events') || 
                         config.url?.startsWith('/gallery') || config.url?.startsWith('/blogs');
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("token");
    if (isAdminRoute && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;