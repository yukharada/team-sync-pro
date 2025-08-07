// pages/projects/ProjectsPage.tsx
import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Pagination,
    Alert,
    CircularProgress,
    Tooltip,
    Breadcrumbs,
    Link
} from '@mui/material';
import {
    Add as AddIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    People as PeopleIcon,
    Assignment as TaskIcon,
    CalendarToday as CalendarIcon,
    Home as HomeIcon,
    NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    fetchProjects,
    deleteProject,
    openCreateModal,
    clearError,
} from '../../store/slices/projectSlice';
import {
    Project,
    PROJECT_STATUS_LABELS,
    PROJECT_PRIORITY_LABELS,
    PROJECT_STATUS_COLORS,
    PROJECT_PRIORITY_COLORS,
} from '../../types/project';
import { ProjectCreateModal } from '../../components/projects/ProjectCreateModal';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export const ProjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {
        projects,
        totalPages,
        currentPage,
        loading,
        error,
        createModalOpen,
    } = useAppSelector((state) => state.projects);

    const [page, setPage] = useState(1);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        dispatch(fetchProjects({ page: page - 1, size: 12 }));
    }, [dispatch, page]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    const handleCreateProject = () => {
        dispatch(openCreateModal());
    }

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, project: Project) => {
        setAnchorEl(event.currentTarget);
        setSelectedProject(project);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedProject(null);
    };

    const handleDeleteProject = async () => {
        if (selectedProject) {
            if (window.confirm(`プロジェクト「${selectedProject.name}」を削除しますか？`)) {
                await dispatch(deleteProject(selectedProject.id));
                dispatch(fetchProjects({ page: page - 1, size: 12 }));
            }
        }
        handleMenuClose();
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'yyyy/MM/dd', { locale: ja });
    };

    const getStatusChip = (status: Project['status']) => (
        <Chip
            label={PROJECT_STATUS_LABELS[status]}
            size="small"
            sx={{
                backgroundColor: PROJECT_STATUS_COLORS[status],
                color: 'white',
                fontWeight: 'bold'
            }}
        />
    );

    const getPriorityChip = (priority: Project['priority']) => (
        <Chip
            label={PROJECT_PRIORITY_LABELS[priority]}
            size="small"
            variant="outlined"
            sx={{
                borderColor: PROJECT_PRIORITY_COLORS[priority],
                color: PROJECT_PRIORITY_COLORS[priority],
                fontWeight: 'bold'
            }}
        />
    );

    if (loading && projects.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* パンくずナビ */}
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                sx={{ mb: 3 }}
                aria-label="breadcrumb"
            >
                <Link
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    color="inherit"
                    onClick={() => navigate('/dashboard')}
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    ダッシュボード
                </Link>
                <Typography
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="text.primary"
                >
                    プロジェクト一覧
                </Typography>
            </Breadcrumbs>
            {/* ヘッダー */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    プロジェクト一覧
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateProject}
                    sx={{ borderRadius: 2 }}
                >
                    新規プロジェクト
                </Button>
            </Box>

            {/* エラー表示 */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* プロジェクトカード一覧 */}
            {projects.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        プロジェクトがありません
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        新しいプロジェクトを作成して始めましょう
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateProject}
                    >
                        最初のプロジェクトを作成
                    </Button>
                </Box>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {projects.map((project) => (
                            <Grid item xs={12} sm={6} md={4} key={project.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderLeft: `4px solid ${project.color}`,
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: (theme) => theme.shadows[8],
                                        },
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        {/* プロジェクトヘッダー */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Typography variant="h6" component="h2" fontWeight="bold" sx={{ flexGrow: 1 }}>
                                                {project.name}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, project)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Box>

                                        {/* 説明 */}
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 2,
                                                height: '2.5em',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                            }}
                                        >
                                            {project.description || 'プロジェクトの説明がありません'}
                                        </Typography>

                                        {/* ステータスと優先度 */}
                                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                            {getStatusChip(project.status)}
                                            {getPriorityChip(project.priority)}
                                        </Box>

                                        {/* 統計情報 */}
                                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                            <Tooltip title="メンバー数">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {project.memberCount}
                                                    </Typography>
                                                </Box>
                                            </Tooltip>
                                            <Tooltip title="タスク数">
                                                <Box sx={{ fontSize: 16, color: 'text.secondary' }} >
                                                    <TaskIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {project.taskCount}
                                                    </Typography>
                                                </Box>
                                            </Tooltip>
                                        </Box>

                                        {/* 期間 */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(project.startDate)} - {formatDate(project.endDate)}
                                            </Typography>
                                        </Box>
                                    </CardContent>

                                    <CardActions>
                                        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                                            オーナー: {project.ownerName}
                                        </Typography>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* ページネーション */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    )}
                </>
            )}

            {/* メニュー */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>
                    <EditIcon sx={{ mr: 1 }} />
                    編集
                </MenuItem>
                <MenuItem onClick={handleDeleteProject} sx={{ color: 'error.main' }}>
                    <DeleteIcon sx={{ mr: 1 }} />
                    削除
                </MenuItem>
            </Menu>

            {/* プロジェクト作成モーダル */}
            {createModalOpen && <ProjectCreateModal />}
        </Container>
    )
}