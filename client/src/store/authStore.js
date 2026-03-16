import { create } from 'zustand';
import axios from 'axios';

const API_URL = '/api';

export const useAuthStore = create((set) => ({
  agent: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  register: async (email, password, fullName, companyName, phone) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        fullName,
        companyName,
        phone
      });
      localStorage.setItem('token', response.data.token);
      set({
        agent: response.data.agent,
        token: response.data.token,
        loading: false
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      set({
        agent: response.data.agent,
        token: response.data.token,
        loading: false
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ agent: null, token: null, error: null });
  },

  getProfile: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ agent: response.data });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  },

  updateProfile: async (updates) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ agent: response.data });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Update failed' });
      throw error;
    }
  }
}));
