// services/projectService.ts
import { api } from './api';
import {
    Project,
    ProjectCreateRequest,
    ProjectUpdateRequest,
    ProjectsResponse
} from '../types/project';
import { ErrorOutline } from '@mui/icons-material';

export const projectService = {
    /**
     * プロジェクト一覧取得（ページング対応）
     */
    async getProjects(page = 0, size = 20): Promise<ProjectsResponse> {
        try {
            const response = await api.get('/projects', {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            console.error('プロジェクト一覧取得失敗');
            return Promise.reject(error);
            throw error;
        }
    },

    /**
     * プロジェクト作成
     */
    async createProject(projectData: ProjectCreateRequest): Promise<Project> {
        try {
            const response = await api.post('/projects', projectData);
            return response.data;
        } catch (error) {
            console.error('プロジェクト作成エラー:', error);
            throw error;
        }
    },

    /**
     * プロジェクト詳細取得
     */
    async getProject(id: number): Promise<Project> {
        try {
            const response = await api.get(`/projects/${id}`);
            return response.data;
        } catch (error) {
            console.error('プロジェクト詳細取得エラー:', error);
            throw error;
        }
    },

    /**
     * プロジェクト更新
     */
    async updateProject(id: number, projectData: ProjectUpdateRequest): Promise<Project> {
        try {
            const response = await api.put(`/projects/${id}`, projectData);
            return response.data;
        } catch (error) {
            console.error('プロジェクト更新エラー:', error);
            throw error;
        }
    },

    /**
     * プロジェクト削除
     */
    async deleteProject(id: number): Promise<void> {
        try {
            await api.delete(`/projects/${id}`);
        } catch (error) {
            console.error('プロジェクト削除エラー:', error);
            throw error;
        }
    }
}