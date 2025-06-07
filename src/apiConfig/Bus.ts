import axios from 'axios';
import { ApiScheduleResponse, Bus, Route, Schedule } from '../types';

const API_BASE_URL = 'http://localhost:8080'; 

// Configure axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const busApi = {

  // Get all buses
  getAll: async () => {
    try {
      const response = await api.get('/bus');
      return response.data;
    } catch (error) {
      console.error('Error fetching buses:', error);
      throw error;
    }
  },

  // Add a new bus
  create: async (busData: any) => {
    try {
      const response = await api.post('/bus', busData);
      return response.data;
    } catch (error) {
      console.error('Error creating bus:', error);
      throw error;
    }
  },

  // Update a bus
  update: async (id: Number, busData: any) => {
    try {
      const response = await api.put(`/bus/${id}`, busData);
      return response.data;
    } catch (error) {
      console.error('Error updating bus:', error);
      throw error;
    }
  },

  // Delete a bus
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/bus/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting bus:', error);
      throw error;
    }
  },
};



// apiConfig/Bus.ts
export const fetchSchedules = async (
  source: string,
  destination: string,
  date: string
): Promise<Schedule[]> => {
  const response = await axios.get<ApiScheduleResponse[]>(`${API_BASE_URL}/bus-schedule/fetch-schedules`, {
    params: { source, destination, date }
  });
  
  return response.data.map(apiSchedule => ({
    id: apiSchedule.id,
    busId: apiSchedule.busResponseDTO.id,
    routeId: apiSchedule.routeResponseDTO?.id || 0,
    departureTime: apiSchedule.departureTime,
    arrivalTime: apiSchedule.arrivalTime,
    scheduleDate: apiSchedule.scheduleDate,
    totalSeats: apiSchedule.totalSeats,
    farePrice: apiSchedule.farePrice,
    // Optionally include the nested objects
    bus: apiSchedule.busResponseDTO,
    route: apiSchedule.routeResponseDTO || undefined
  }));
};


export const fetchBuses = async (): Promise<Bus[]> => {
  const response = await api.get(`/bus`);
  return response.data.data;
};

export const fetchRoutes = async (): Promise<Route[]> => {
  const response = await api.get(`/bus-route`);
  return response.data.data;
};


export const registerUser = async (userData: {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}) => {
  const response = await api.post('/auth-user/register', userData);
  return response.data;
};


export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth-user/login`, credentials);
    
    return {
      id: response.data.id,
      username: response.data.username,
      email: response.data.email,
      role: response.data.role,
      phoneNumber: response.data.phoneNumber,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Handle specific error statuses
        if (error.response.status === 401) {
          throw new Error('Invalid email or password');
        }
        if (error.response.status === 403) {
          throw new Error('Account not verified');
        }
        throw new Error(error.response.data.message || 'Login failed');
      }
    }
    throw new Error('Network error. Please try again.');
  }
};


export const fetchCities  = async (): Promise<string[]> => {
  const response = await api.get(`/bus-route/cities`);
  return response.data;
};