import axios from 'axios';

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
  update: async (id: string, busData: any) => {
    try {
      const response = await api.put(`/bus/${id}`, busData);
      return response.data;
    } catch (error) {
      console.error('Error updating bus:', error);
      throw error;
    }
  },

  // Delete a bus
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/bus/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting bus:', error);
      throw error;
    }
  },
};