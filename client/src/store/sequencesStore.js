import { create } from 'zustand';
import axios from 'axios';

const API_URL = '/api';

export const useSequencesStore = create((set) => ({
  sequences: [],
  loading: false,
  error: null,

  getSequences: async () => {
    const token = localStorage.getItem('token');
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/sequences`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ sequences: response.data.sequences || [], loading: false });
      return response.data.sequences;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch sequences', loading: false });
      return [];
    }
  },

  createSequence: async (data) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${API_URL}/sequences`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set(state => ({
        sequences: [response.data, ...state.sequences]
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to create sequence' });
      throw error;
    }
  },

  deleteSequence: async (sequenceId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/sequences/${sequenceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set(state => ({
        sequences: state.sequences.filter(s => s.id !== sequenceId && s._id !== sequenceId)
      }));
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to delete sequence' });
      throw error;
    }
  },

  toggleSequence: async (sequenceId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `${API_URL}/sequences/${sequenceId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set(state => ({
        sequences: state.sequences.map(s =>
          (s.id === sequenceId || s._id === sequenceId)
            ? { ...s, isActive: response.data.isActive }
            : s
        )
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to toggle sequence' });
      throw error;
    }
  }
}));
