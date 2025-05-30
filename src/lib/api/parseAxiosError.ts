import axios from 'axios';

export function parseAxiosError(error: unknown, defaultMessage = '알 수 없는 오류가 발생했습니다.') {
    if (axios.isAxiosError(error)) {
        const serverError = error?.response?.data?.error;
        if (serverError && typeof serverError === 'object' && 'message' in serverError) return (serverError).message;
        if (error?.response?.data?.message) return error.response.data.message;
        return '로그인 처리 중 오류가 발생했습니다.';
    }
    return defaultMessage;
}