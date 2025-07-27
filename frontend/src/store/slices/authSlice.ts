// frontend/src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { User } from '../../types';

// 型定義
export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export interface AuthResponse {
    token: string;
    type: string;
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
}

// 初期状態
const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    isAuthenticated: !!localStorage.getItem('token'),
    error: null,
};

// Async Actions
export const loginUser = createAsyncThunk<AuthResponse, LoginCredentials>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk<AuthResponse, RegisterData>(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authService.register(userData);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

// Auth Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = {
                    id: action.payload.id,
                    username: action.payload.username,
                    email: action.payload.email,
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    role: action.payload.role as User['role'],
                    enabled: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = {
                    id: action.payload.id,
                    username: action.payload.username,
                    email: action.payload.email,
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    role: action.payload.role as User['role'],
                    enabled: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;