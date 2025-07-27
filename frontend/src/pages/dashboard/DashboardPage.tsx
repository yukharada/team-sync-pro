// frontend/src/pages/dashboard/DashboardPage.tsx
import React from 'react';
import {
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
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        handleClose();
    }

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

            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    ダッシュボード
                </Typography>

                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            ようこそ、{getDisplayName()}さん！
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
            </Box>
        </Box>
    );
};

export default DashboardPage;