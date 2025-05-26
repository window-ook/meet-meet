import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function useCancelGathering(token: string | null) {
    const queryClient = useQueryClient();

    const cancelGathering = useMutation({
        mutationFn: async (id: number) => {
            if (!token) throw new Error('로그인이 필요합니다.');
            const response = await axios.put(`/api/gatherings/cancel?id=${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gatherings', 'infinite'] });
            alert('모임을 삭제했습니다.');
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

    return { cancelGathering: cancelGathering.mutate }
}