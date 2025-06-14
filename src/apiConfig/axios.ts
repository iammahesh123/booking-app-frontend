// apiConfig/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Type definitions for API responses
interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
}

interface ApiError {
  message: string;
  status?: number;
  data?: any;
  isAxiosError: boolean;
}

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://bus-booking-svc-latest.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      isAxiosError: true,
    };

    if (error.response) {
      // The request was made and the server responded with a status code
      apiError.status = error.response.status;
      apiError.data = error.response.data;

      switch (error.response.status) {
        case 400:
          apiError.message = 'Bad request. Please check your input.';
          break;
        case 401:
          apiError.message = 'Unauthorized. Please login again.';
          break;
        case 403:
          apiError.message = 'Forbidden. You don\'t have permission to access this resource.';
          break;
        case 404:
          apiError.message = 'Resource not found.';
          break;
        case 500:
          apiError.message = 'Server error. Please try again later.';
          break;
        default:
          apiError.message = 'An unexpected error occurred.';
      }

      // If the server provides an error message, use that instead
      if (error.response.data?.message) {
        apiError.message = error.response.data.message;
      }
    } else if (error.request) {
      // The request was made but no response was received
      apiError.message = 'No response from server. Please check your network connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      apiError.message = error.message || 'Request failed. Please try again.';
    }

    console.error('API Error:', apiError.message);
    return Promise.reject(apiError);
  }
);

/**
 * Generic GET request
 * @param url The endpoint URL
 * @param config Optional axios config
 * @returns Promise with response data
 */
export const get = async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.get<T>(url, config);
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config: response.config,
  };
};

/**
 * Generic POST request
 * @param url The endpoint URL
 * @param data The request payload
 * @param config Optional axios config
 * @returns Promise with response data
 */
export const post = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.post<T>(url, data, config);
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config: response.config,
  };
};

/**
 * Generic PUT request
 * @param url The endpoint URL
 * @param data The request payload
 * @param config Optional axios config
 * @returns Promise with response data
 */
export const put = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.put<T>(url, data, config);
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config: response.config,
  };
};

/**
 * Generic DELETE request
 * @param url The endpoint URL
 * @param config Optional axios config
 * @returns Promise with response data
 */
export const del = async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.delete<T>(url, config);
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config: response.config,
  };
};

export default axiosInstance;