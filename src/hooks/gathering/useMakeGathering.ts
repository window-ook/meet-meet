import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function useMakeGathering(token: string | null) {
    const searchParams = useSearchParams();
    const queries = searchParams.toString();
    const queryClient = useQueryClient();

    const makeGathering = useMutation({
        mutationFn: async (formData: FormData) => {
            if (!token) throw new Error('로그인이 필요합니다.');
            const response = await axios.post(`/api/gatherings`, formData, { headers: { Authorization: `Bearer ${token}` } });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gatherings', 'infinite'] }); // 모임 목록 새로 캐시 및 리렌더
            queryClient.invalidateQueries({ queryKey: ["joinedMeetings", queries, token] }); // 마이페이지 '나의 모임' 새로 캐시 및 리렌더
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

    return { makeGathering: makeGathering.mutate }
}