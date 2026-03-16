import { create } from 'zustand';
import axios from 'axios';

const API_URL = '/api';

export const useLeadsStore = create((set) => ({
  leads: [],
  selectedLead: null,
  loading: false,
  error: null,

  getLeads: async (status = null) => {
    const token = localStorage.getItem('token');
    set({ loading: true, error: null });
    try {
      const params = status ? { status } : {};
      const response = await axios.get(`${API_URL}/leads`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      set({ leads: response.data.leads, loading: false });
      return response.data.leads;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch leads', loading: false });
      throw error;
    }
  },

  getLead: async (leadId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_URL}/leads/${leadId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ selectedLead: response.data });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch lead' });
      throw error;
    }
  },

  updateLeadStatus: async (leadId, status, score) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `${API_URL}/leads/${leadId}/status`,
        { status, score },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set(state => ({
        leads: state.leads.map(lead => lead.id === leadId ? { ...lead, status: response.data.status, score: response.data.score } : lead)
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to update lead' });
      throw error;
    }
  },

  deleteLead: async (leadId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/leads/${leadId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set(state => ({
        leads: state.leads.filter(lead => lead.id !== leadId)
      }));
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to delete lead' });
      throw error;
    }
  }
}));
