import axios from 'axios';

/**
 * 클라이언트 axios 인스턴스
 * @description 토큰이 자동으로 주입됩니다.
 */
const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URI,
    withCredentials: true,
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosClient;