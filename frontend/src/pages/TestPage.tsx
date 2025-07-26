// frontend/src/pages/TestPage.tsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { healthService } from '../services/healthService';
import { HealthResponse } from '../types';

const TestPage: React.FC = () => {
    const [health, setHealth] = useState<HealthResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkHealth = async () => {
        setLoading(true);
        setError(null);
        try {
            const healthData = await healthService.checkHealth();
            setHealth(healthData);
        } catch (err) {
            setError('Backend connection failed');
            console.error('Health check failed', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkHealth();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant='h4' gutterBottom>
                TeamSync Pro - Connection Test
            </Typography>

            <Button
                variant='contained'
                onClick={checkHealth}
                disabled={loading}
                sx={{ mb: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : 'Test Backend Connection'}
            </Button>

            {error && (
                <Alert severity='error' sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {health && (
                <Alert severity='success' sx={{ mb: 2 }}>
                    <Typography variant='h6'>Backend Connected Successfully!</Typography>
                    <Typography>Status: {health.status}</Typography>
                    <Typography>Service: {health.service}</Typography>
                    <Typography>Version: {health.version}</Typography>
                    <Typography>Timestamp: {health.timestamp}</Typography>
                </Alert>
            )}
        </Box>
    );
};

export default TestPage;