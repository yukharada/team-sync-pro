// frontend/src/services/healthService.ts
import api from './api';
import { HealthResponse } from '../types';

export const healthService = {
    checkHealth: async (): Promise<HealthResponse> => {
        const response = await api.get<HealthResponse>('/health');
        return response.data;
    },
};