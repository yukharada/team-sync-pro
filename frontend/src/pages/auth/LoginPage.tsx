// frontend/src/pages/auth/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Link,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    // 認証済みの場合はダッシュボードにリダイレクト
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // エラークリア
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password) {
            dispatch(loginUser({ username, password }));
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Card sx={{ minWidth: 400, maxWidth: 500 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        TeamSync Pro
                    </Typography>
                    <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
                        ログイン
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="ユーザー名"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            margin="normal"
                            required
                            disabled={isLoading}
                        />
                        <TextField
                            fullWidth
                            label="パスワード"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading || !username || !password}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'ログイン'}
                        </Button>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => navigate('/register')}
                            sx={{ textDecoration: 'none' }}
                        >
                            アカウントをお持ちでない方はこちら
                        </Link>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;