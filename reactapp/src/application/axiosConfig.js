import axios from "axios";
import { store } from "./State/store";

const API_BASE_URL = "http://localhost:9000";

const getToken = () => {
    const state = store.getState();
    return state.userReducer?.token || localStorage.getItem("token");
};

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// **Attach JWT Token Interceptor Globally**
axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// **Handle Global Unauthorized Errors (Token Expired)**
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403 || error.response?.status === 401) {
            console.error("JWT Token Expired or Invalid - Logging out...");
            store.dispatch({ type: "SIGN_OUT_USER" });
            localStorage.removeItem("token"); // Remove expired token
            window.location.href = "/login"; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
