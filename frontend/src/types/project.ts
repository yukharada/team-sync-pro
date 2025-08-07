// types/project.ts

export enum ProjectStatus {
    PLANNING = 'PLANNING',
    ACTIVE = 'ACTIVE',
    ON_HOLD = 'ON_HOLD',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export enum ProjectPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export interface Project {
    id: number;
    name: string;
    description?: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate?: string;
    endDate?: string;
    color: string;
    ownerId: number;
    ownerName: string;
    memberCount: number;
    taskCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectCreateRequest {
    name: string;
    description?: string;
    status?: ProjectStatus;
    priority?: ProjectPriority;
    startDate?: string;
    endDate?: string;
    color?: string;
}

export interface ProjectUpdateRequest {
    name: string;
    description?: string;
    status?: ProjectStatus;
    priority?: ProjectPriority;
    startDate?: string;
    endDate?: string;
    color?: string;
}

export interface ProjectsResponse {
    content: Project[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

// ステータス表示用のヘルパー
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
    [ProjectStatus.PLANNING]: '計画中',
    [ProjectStatus.ACTIVE]: '進行中',
    [ProjectStatus.ON_HOLD]: '保留',
    [ProjectStatus.COMPLETED]: '完了',
    [ProjectStatus.CANCELLED]: 'キャンセル'
};

export const PROJECT_PRIORITY_LABELS: Record<ProjectPriority, string> = {
    [ProjectPriority.LOW]: '低',
    [ProjectPriority.MEDIUM]: '中',
    [ProjectPriority.HIGH]: '高',
    [ProjectPriority.CRITICAL]: '緊急'
};

// ステータス別の色設定
export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
    [ProjectStatus.PLANNING]: '#9e9e9e',
    [ProjectStatus.ACTIVE]: '#4caf50',
    [ProjectStatus.ON_HOLD]: '#ff9800',
    [ProjectStatus.COMPLETED]: '#2196f3',
    [ProjectStatus.CANCELLED]: '#f44336'
};

// 優先度別の色設定
export const PROJECT_PRIORITY_COLORS: Record<ProjectPriority, string> = {
    [ProjectPriority.LOW]: '#9e9e9e',
    [ProjectPriority.MEDIUM]: '#4caf50',
    [ProjectPriority.HIGH]: '#ff9800',
    [ProjectPriority.CRITICAL]: '#f44336'
};