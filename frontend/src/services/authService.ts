// frontend/src/services/authService.ts
import api from './api';
import { LoginCredentials, RegisterData, AuthResponse, registerUser } from '../store/slices/authSlice';

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    register: async (userData: RegisterData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },
};