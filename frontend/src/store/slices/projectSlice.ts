// frontend/src/store/slices/projectSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { projectService } from '../../services/projectService';
import {
    Project,
    ProjectCreateRequest,
    ProjectUpdateRequest,
    ProjectsResponse
} from '../../types/project';
import { create } from '@mui/material/styles/createTransitions';
import { AccessTime } from '@mui/icons-material';
import { act } from 'react';

interface ProjectState {
    projects: Project[];
    currentProject: Project | null;
    totalElements: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
    createModalOpen: boolean;
}

const initialState: ProjectState = {
    projects: [],
    currentProject: null,
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
    createModalOpen: false,
};

// 非同期アクション
export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async ({ page = 0, size = 20 }: { page?: number; size?: number } = {}) => {
        const response = await projectService.getProjects(page, size);
        return response;
    }
);

export const createProject = createAsyncThunk(
    'projects/createProject',
    async (projectData: ProjectCreateRequest) => {
        const response = await projectService.createProject(projectData);
        return response;
    }
);

export const fetchProject = createAsyncThunk(
    'projects/fetchProject',
    async (id: number) => {
        const response = await projectService.getProject(id);
        return response;
    }
);

export const updateProject = createAsyncThunk(
    'projects/updateProject',
    async ({ id, projectData }: { id: number; projectData: ProjectUpdateRequest }) => {
        const response = await projectService.updateProject(id, projectData);
        return response;
    }
);

export const deleteProject = createAsyncThunk(
    'projects/deleteProject',
    async (id: number) => {
        await projectService.deleteProject(id);
        return id;
    }
);

const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentProject: (state, action: PayloadAction<Project | null>) => {
            state.currentProject = action.payload;
        },
        openCreateModal: (state) => {
            state.createModalOpen = true;
        },
        closeCreateModal: (state) => {
            state.createModalOpen = false;
        },
        clearCurrentProject: (state) => {
            state.currentProject = null;
        },
    },

    extraReducers: (builder) => {
        builder
            //fetchProjects
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<ProjectsResponse>) => {
                state.loading = false;
                state.projects = action.payload.content;
                state.totalElements = action.payload.totalElements;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.number;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'プロジェクト一覧の取得に失敗しました';
            })

            // createProject
            .addCase(createProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
                state.loading = false;
                state.projects.unshift(action.payload);
                state.totalElements += 1;
                state.createModalOpen = false;
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'プロジェクトの作成に失敗しました';
            })

            // fetchProject
            .addCase(fetchProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProject.fulfilled, (state, action: PayloadAction<Project>) => {
                state.loading = false;
                state.currentProject = action.payload;
            })
            .addCase(fetchProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'プロジェクト詳細の取得に失敗しました';
            })

            // updateProject
            .addCase(updateProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
                state.loading = false;
                const index = state.projects.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
                if (state.currentProject?.id === action.payload.id) {
                    state.currentProject = action.payload;
                }
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'プロジェクトの更新に失敗しました';
            })

            // deleteProject
            .addCase(deleteProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProject.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.projects = state.projects.filter(p => p.id !== action.payload);
                state.totalElements -= 1;
                if (state.currentProject?.id === action.payload) {
                    state.currentProject = null;
                }
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'プロジェクトの削除に失敗しました';
            });
    },
});

export const {
    clearError,
    setCurrentProject,
    openCreateModal,
    closeCreateModal,
    clearCurrentProject,
} = projectSlice.actions;

export default projectSlice.reducer;