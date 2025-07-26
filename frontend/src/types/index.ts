// frontend/src/types/index.ts
export interface User {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    role: 'USER' | 'ADMIN' | 'PROJECT_MANAGER';
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    status: string;
}

export interface HealthResponse {
    status: string;
    timestamp: string;
    service: string;
    version: string;
}