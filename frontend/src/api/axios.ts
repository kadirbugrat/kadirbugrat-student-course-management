import axios from 'axios';


const BASE_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: her istekte Authorization header ekle
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // veya context'ten alabilirsin
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
