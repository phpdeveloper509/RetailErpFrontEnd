// src/utils/axiosConfig.js
import axios from 'axios';
import { toast } from 'react-toastify';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      toast.error("Session expired. Please login again.");
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
