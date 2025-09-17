import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: baseURL,
});

// --- REQUEST INTERCEPTOR (This part is already correct) ---
// This runs BEFORE any request is sent. Its job is to attach the token.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- NEW & CRITICAL: RESPONSE INTERCEPTOR ---
// This runs AFTER a response is received. Its job is to check for a 401 error.
api.interceptors.response.use(
  // If the response is successful (status 2xx), just return it.
  (response) => {
    return response;
  },
  // If the response is an error...
  async (error) => {
    // Check if the error is a 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      console.log("Token expired or invalid. Logging out...");
      
      // 1. Clear all authentication data from storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('eventoria_user');

      // 2. Redirect the user to the login page
      // We do a full page reload to ensure all old state is cleared.
      window.location.href = '/login';

      // You could also display a message here
      // alert("Your session has expired. Please log in again.");
    }
    
    // For any other error, just pass it along
    return Promise.reject(error);
  }
);


export default api;