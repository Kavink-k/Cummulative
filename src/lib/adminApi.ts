import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users`;
// Get current user ID from localStorage
const getUserId = () => {
    const user = localStorage.getItem('auth_user');
    if (user) {
        const userData = JSON.parse(user);
        return userData.id;
    }
    return null;
};

// Get headers with user ID
const getHeaders = () => {
    const userId = getUserId();
    return {
        'x-user-id': userId || '',
    };
};

export interface User {
    id: number;
    name: string;
    designation: string;
    institutionId: number;
    institution?: Institution;
    email: string;
    phone: string;
    role: 'user' | 'admin' | 'principal';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
}

export interface UserStats {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    recentRegistrations: number;
    usersByRole: {
        admin: number;
        user: number;
        principal: number;
    };
    recentUsers: User[];
}

export interface PaginatedUsers {
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface BulkUploadResult {
    totalRows: number;
    successCount: number;
    errorCount: number;
    success: Array<{
        row: number;
        email: string;
        name: string;
    }>;
    errors: Array<{
        row: number;
        email: string;
        error: string;
    }>;
}

// Get user statistics
export const getUserStats = async (): Promise<UserStats> => {
    const response = await axios.get(`${API_BASE_URL}/admin/stats`, {
        headers: getHeaders(),
    });
    return response.data.data;
};

// Get all users with pagination and search
export const getUsers = async (
    page: number = 1,
    limit: number = 10,
    search: string = ''
): Promise<PaginatedUsers> => {
    const response = await axios.get(`${API_BASE_URL}/admin/all`, {
        headers: getHeaders(),
        params: { page, limit, search },
    });
    return response.data.data;
};

// Create new user
export const createUser = async (userData: {
    name: string;
    designation: string;
    institutionId: number;
    email: string;
    phone: string;
    password: string;
    role?: 'user' | 'admin' | 'principal';
}): Promise<User> => {
    const response = await axios.post(`${API_BASE_URL}/admin/create`, userData, {
        headers: getHeaders(),
    });
    return response.data.data;
};

// Update user
export const updateUser = async (
    id: number,
    userData: Partial<{
        name: string;
        designation: string;
        institutionName: string;
        email: string;
        phone: string;
        password: string;
        role: 'user' | 'admin' | 'principal';
        isActive: boolean;
    }>
): Promise<User> => {
    const response = await axios.put(`${API_BASE_URL}/admin/${id}`, userData, {
        headers: getHeaders(),
    });
    return response.data.data;
};

// Delete/deactivate user
export const deleteUser = async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: getHeaders(),
    });
};

// Bulk upload users
export const bulkUploadUsers = async (file: File): Promise<BulkUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/admin/bulk-upload`, formData, {
        headers: {
            ...getHeaders(),
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
};

// Download template
export const downloadTemplate = async (format: 'csv' | 'xlsx' = 'xlsx'): Promise<void> => {
    const response = await axios.get(`${API_BASE_URL}/admin/template`, {
        headers: getHeaders(),
        params: { format },
        responseType: 'blob',
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `user_upload_template.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

// ========== INSTITUTION MANAGEMENT ==========

const INSTITUTION_API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/institution-details`;

export interface Institution {
    id: number;
    institutionName: string;
    address: string;
    batch: string;
    createdAt: string;
    updatedAt: string;
}

// Get all institutions
export const getInstitutions = async (): Promise<Institution[]> => {
    const response = await axios.get(INSTITUTION_API_BASE_URL);
    return response.data.data;
};

// Create new institution
export const createInstitution = async (data: {
    institutionName: string;
    address: string;
    batch: string;
}): Promise<Institution> => {
    const response = await axios.post(INSTITUTION_API_BASE_URL, data);
    return response.data.data;
};

// Update institution
export const updateInstitution = async (
    id: number,
    data: Partial<{
        institutionName: string;
        address: string;
        batch: string;
    }>
): Promise<Institution> => {
    const response = await axios.put(`${INSTITUTION_API_BASE_URL}/${id}`, data);
    return response.data.data;
};

// Delete institution
export const deleteInstitution = async (id: number): Promise<void> => {
    await axios.delete(`${INSTITUTION_API_BASE_URL}/${id}`);
};
