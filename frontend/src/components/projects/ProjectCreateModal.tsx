// components/projects/ProjectCreateModal.tsx

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Grid,
    IconButton,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    createProject,
    closeCreateModal,
    clearError,
} from '../../store/slices/projectSlice';
import {
    ProjectCreateRequest,
    ProjectStatus,
    ProjectPriority,
    PROJECT_STATUS_LABELS,
    PROJECT_PRIORITY_LABELS,
} from '../../types/project';

const PROJECT_COLORS = [
    '#1976d2', // Blue
    '#388e3c', // Green
    '#f57c00', // Orange
    '#d32f2f', // Red
    '#7b1fa2', // Purple
    '#303f9f', // Indigo
    '#0097a7', // Cyan
    '#689f38', // Light Green
    '#e64a19', // Deep Orange
    '#5d4037', // Brown
];

export const ProjectCreateModal: React.FC = () => {
    const dispatch = useAppDispatch();
    const { loading, error, createModalOpen } = useAppSelector((state) => state.projects);

    const [formData, setFormData] = useState<ProjectCreateRequest>({
        name: '',
        description: '',
        status: ProjectStatus.PLANNING,
        priority: ProjectPriority.MEDIUM,
        color: '#1976d2',
    });

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const handleClose = () => {
        dispatch(closeCreateModal());
        dispatch(clearError());
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            status: ProjectStatus.PLANNING,
            priority: ProjectPriority.MEDIUM,
            color: '#1976d2',
        });
        setStartDate(null);
        setEndDate(null);
        setFormErrors({});
    };

    const handleInputChange = (field: keyof ProjectCreateRequest) =>
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setFormData(prev => ({
                ...prev,
                [field]: event.target.value,
            }));
            // エラーをクリア
            if (formErrors[field]) {
                setFormErrors(prev => ({ ...prev, [field]: '' }));
            }
        };

    const handleSelectChange = (field: keyof ProjectCreateRequest) =>
        (event: any) => {
            setFormData(prev => ({
                ...prev,
                [field]: event.target.value,
            }));
        };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = 'プロジェクト名は必須です';
        } else if (formData.name.length > 100) {
            errors.name = 'プロジェクト名は100文字以下で入力してください';
        }

        if (formData.description && formData.description.length > 1000) {
            errors.description = '説明は1000文字以下で入力してください';
        }

        if (startDate && endDate && startDate > endDate) {
            errors.endDate = '終了日は開始日以降の日付を選択してください';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const projectData: ProjectCreateRequest = {
            ...formData,
            startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
            endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
        };

        try {
            await dispatch(createProject(projectData)).unwrap();
            handleClose();
        } catch (error) {
            // エラーは Redux state で管理
            console.error('プロジェクト作成エラー:', error);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            <Dialog
                open={createModalOpen}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    新規プロジェクト作成
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={handleSubmit}>
                    <DialogContent dividers>
                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <Grid container spacing={3}>
                            {/* プロジェクト名 */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="プロジェクト名"
                                    value={formData.name}
                                    onChange={handleInputChange('name')}
                                    error={!!formErrors.name}
                                    helperText={formErrors.name}
                                    required
                                    autoFocus
                                />
                            </Grid>

                            {/* 説明 */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="説明"
                                    multiline
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleInputChange('description')}
                                    error={!!formErrors.description}
                                    helperText={formErrors.description}
                                />
                            </Grid>

                            {/* ステータスと優先度 */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>ステータス</InputLabel>
                                    <Select
                                        value={formData.status}
                                        label="ステータス"
                                        onChange={handleSelectChange('status')}
                                    >
                                        {Object.values(ProjectStatus).map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {PROJECT_STATUS_LABELS[status]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>優先度</InputLabel>
                                    <Select
                                        value={formData.priority}
                                        label="優先度"
                                        onChange={handleSelectChange('priority')}
                                    >
                                        {Object.values(ProjectPriority).map((priority) => (
                                            <MenuItem key={priority} value={priority}>
                                                {PROJECT_PRIORITY_LABELS[priority]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* 開始日と終了日 */}
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="開始日"
                                    value={startDate}
                                    onChange={(value) => setStartDate(value as Date | null)}
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="終了日"
                                    value={endDate}
                                    onChange={(value) => setEndDate(value as Date | null)}
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth />
                                    )}
                                // slotProps={{
                                //     textField: {
                                //         fullWidth: true,
                                //         error: !!formErrors.endDate,
                                //         helperText: formErrors.endDate,
                                //     },
                                // }}
                                />
                            </Grid>

                            {/* カラー選択 */}
                            <Grid item xs={12}>
                                <Box sx={{ mb: 1 }}>
                                    <label>プロジェクトカラー</label>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {PROJECT_COLORS.map((color) => (
                                        <Box
                                            key={color}
                                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                backgroundColor: color,
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                border: formData.color === color ? '3px solid #000' : '2px solid #ddd',
                                                transition: 'transform 0.2s',
                                                '&:hover': {
                                                    transform: 'scale(1.1)',
                                                },
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleClose} disabled={loading}>
                            キャンセル
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            {loading ? '作成中...' : 'プロジェクト作成'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </LocalizationProvider>
    );
};

export default ProjectCreateModal;