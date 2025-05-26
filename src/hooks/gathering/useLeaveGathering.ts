import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function useLeaveGathering(token: string | null) {
    const queryClient = useQueryClient();

    const leaveGathering = useMutation({
        mutationFn: async (id: number) => {
            if (!token) throw new Error('로그인이 필요합니다.');
            const response = await axios.delete(`/api/gatherings/leave?id=${id}`, { headers: { Authorization: `Bearer ${token}` } });
            return response.data;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['gatheringDetail', id] });
            queryClient.invalidateQueries({ queryKey: ['gatheringCheckJoin', id] });
            alert('참여 취소했습니다.');
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

    return { leaveGathering: leaveGathering.mutate }
}