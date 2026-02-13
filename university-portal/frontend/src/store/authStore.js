import { create } from 'zustand';
import { authService } from '../services/services';

export const useAuthStore = create((set) => ({
  user: authService.getCurrentUser(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email, password) => {
    const data = await authService.login(email, password);
    set({ user: data, token: data.token, isAuthenticated: true });
    return data;
  },

  register: async (userData) => {
    const data = await authService.register(userData);
    set({ user: data, token: data.token, isAuthenticated: true });
    return data;
  },

  logout: () => {
    authService.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    set({ user: userData });
    localStorage.setItem('user', JSON.stringify(userData));
  }
}));



