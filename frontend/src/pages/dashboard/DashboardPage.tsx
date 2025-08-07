// frontend/src/pages/dashboard/DashboardPage.tsx
import React, { useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    AppBar,
    Toolbar,
    Avatar,
    Menu,
    MenuItem,
    Grid,
    Chip
} from '@mui/material';
import {
    AccountCircle,
    ExitToApp as LogoutIcon,
    Add as AddIcon,
    Folder as ProjectIcon,
    Assignment as TaskIcon,
    People as TeamIcon,
    TrendingUp as AnalyticsIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { fetchProjects } from '../../store/slices/projectSlice';

const DashboardPage: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const { projects } = useAppSelector((state) => state.projects);

    useEffect(() => {
        // 最新のプロジェクト数件を取得
        dispatch(fetchProjects({ page: 0, size: 6 }));
    }, [dispatch]);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleNavigateToProjects = () => {
        navigate('/projects');
    };

    const quickActions = [
        {
            title: 'プロジェクト管理',
            description: 'プロジェクトの作成・編集・削除',
            icon: <ProjectIcon fontSize="large" />,
            color: '#1976d2',
            action: handleNavigateToProjects,
        },
        {
            title: 'タスク管理',
            description: 'タスクの作成・割り当て・進捗管',
            icon: <TaskIcon fontSize="large" />,
            color: '#388e3c',
            action: () => console.log('タスク管理'),
        },
        {
            title: 'チーム管理',
            description: 'メンバーの招待・権限管理',
            icon: <TeamIcon fontSize="large" />,
            color: '#f57c00',
            action: () => console.log('チーム管理'),
        },
        {
            title: 'レポート',
            description: 'プロジェクトの進捗レポート',
            icon: <AnalyticsIcon fontSize="large" />,
            color: '#7b1fa2',
            action: () => console.log('レポート'),
        },
    ];

    const getDisplayName = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.lastName} ${user.firstName}`;
        }
        return user?.username || 'ユーザー';
    };

    const getInitials = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.lastName.charAt(0)}${user.firstName.charAt(0)}`;
        }
        return user?.username?.charAt(0).toUpperCase() || 'U';
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* ヘッダー */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        TeamSync Pro
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ mr: 2 }}>
                            {getDisplayName()}
                        </Typography>
                        <Avatar
                            onClick={handleMenu}
                            sx={{ cursor: 'pointer', bgcolor: 'secondary.main' }}
                        >
                            {getInitials()}
                        </Avatar>
                        <Menu
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* メインコンテンツ */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    ダッシュボード
                </Typography>

                {/* ウェルカムセクション */}
                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            おかえりなさい、{getDisplayName()}さん！
                        </Typography>
                    </CardContent>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        TeamSync Proへようこそ。プロジェクト管理を始めましょう。
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            ユーザ情報:
                        </Typography>
                        <Typography variant="body2">
                            ・ユーザ名: {user?.username}
                        </Typography>
                        <Typography variant="body2">
                            ・メールアドレス: {user?.email}
                        </Typography>
                        <Typography variant="body2">
                            ・権限: {user?.role}
                        </Typography>
                    </Box>
                </Card>
                <Card sx={{ mt: 3 }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            クイックアクション
                        </Typography>
                        <Grid container spacing={3}>
                            {quickActions.map((action, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: (theme) => theme.shadows[8],
                                            },
                                        }}
                                        onClick={action.action}
                                    >
                                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                            <Box
                                                sx={{
                                                    color: action.color,
                                                    mb: 2,
                                                }}
                                            >
                                                {action.icon}
                                            </Box>
                                            <Typography variant="h6" component="h3" gutterBottom>
                                                {action.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {action.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Card>

                {/* 最新のプロジェクト */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" component="h2">
                            最新のプロジェクト
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={handleNavigateToProjects}
                            endIcon={<ProjectIcon />}
                        >
                            すべて表示
                        </Button>
                    </Box>

                    {projects.length === 0 ? (
                        <Card sx={{ textAlign: 'center', py: 6 }}>
                            <CardContent>
                                <ProjectIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    プロジェクトがありません
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    新しいプロジェクトを作成して始めましょう
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleNavigateToProjects}
                                >
                                    プロジェクトを作成
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Grid container spacing={3}>
                            {projects.slice(0, 6).map((project) => (
                                <Grid item xs={12} sm={6} md={4} key={project.id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            borderLeft: `4px solid ${project.color}`,
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: (theme) => theme.shadows[4],
                                            },
                                        }}
                                        onClick={handleNavigateToProjects}
                                    >
                                        <CardContent>
                                            <Typography variant="h6" component="h3" gutterBottom>
                                                {project.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    mb: 2,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                }}
                                            >
                                                {project.description || 'プロジェクトの説明がありません'}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Chip label={project.status} size="small" color="primary" />
                                                <Chip label={`${project.memberCount}人`} size="small" variant="outlined" />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default DashboardPage;