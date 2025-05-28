import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

/**
 * 모임 생성 훅
 * @param token 토큰
 * @returns {function} createGathering - 모임 생성 함수
 */
export const useCreateGathering = (token: string | null) => {
    const queryClient = useQueryClient();

    const createGathering = useMutation({
        mutationFn: async (formData: FormData) => {
            if (!token) throw new Error('로그인이 필요합니다.');
            const response = await axios.post(`/api/gatherings`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gatherings', 'infinite'] });
            queryClient.invalidateQueries({ queryKey: ["createdGatherings", token] });
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                alert(serverError?.message || '에러가 발생했습니다.');
            } else {
                alert(error.message);
            }
        }
    });

    return { createGathering: createGathering.mutate }
}