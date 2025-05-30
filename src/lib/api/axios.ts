import axios from 'axios';

const parseAxiosError = (error: unknown, message = '요청 중 에러가 발생했습니다.') => {
    if (axios.isAxiosError(error)) {
        const serverError = error?.response?.data?.error;
        if (serverError && typeof serverError === 'object' && 'message' in serverError) return serverError.message;
        if (error?.response?.data?.message) return error.response.data.message;
        return '요청 중 에러가 발생했습니다.';
    }
    return message;
}

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URI,
    withCredentials: true,
});

// 요청 인터셉터
apiClient.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터
apiClient.interceptors.response.use(
    response => response,
    error => {
        const message = parseAxiosError(error);
        error.parsedMessage = message;
        return Promise.reject(error);
    }
);

export default apiClient;