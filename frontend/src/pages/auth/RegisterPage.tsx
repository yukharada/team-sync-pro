// frontend/src/pages/auth/RegisterPage.tsx
import React, { useState, useEffect } from 'react'
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
    Grid
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearError, registerUser } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { username, email, password, firstName, lastName } = formData;

        if (username && email && password) {
            dispatch(registerUser({
                username,
                email,
                password,
                firstName: firstName || undefined,
                lastName: lastName || undefined,
            }));
        }
    };

    const isFormValid = formData.username && formData.email && formData.password;

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
            <Card sx={{ minWidth: 500, maxWidth: 600 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        TeamSync Pro
                    </Typography>
                    <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
                        新規登録
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="性"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="名"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            fullWidth
                            label="ユーザー名"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            margin="normal"
                            required
                            disabled={isLoading}
                        />

                        <TextField
                            fullWidth
                            label="メールアドレス"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                            disabled={isLoading}
                        />

                        <TextField
                            fullWidth
                            label="パスワード"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            margin="normal"
                            required
                            disabled={isLoading}
                            helperText="6文字以上で入力してください"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading || !isFormValid}
                        >
                            {isLoading ? <CircularProgress size={24} /> : '登録'}
                        </Button>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => navigate('/login')}
                            sx={{ textDecoration: 'none' }}
                        >
                            既にアカウントをお持ちの方はこちら
                        </Link>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default RegisterPage;