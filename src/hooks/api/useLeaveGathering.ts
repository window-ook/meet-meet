'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface UseLeaveGatheringProps {
    token: string | null;
    onErrorCallback?: (msg: string) => void;
}

/** 모임 참여 취소 훅
* @param token 토큰
* @param onErrorCallback 에러 콜백 함수 (모달에 표시할 메세지를 전달 받음)
* @returns {function} leaveGathering - 모임 참여 취소 함수
*/
export const useLeaveGathering = ({ token, onErrorCallback }: UseLeaveGatheringProps) => {
    const queryClient = useQueryClient();

    const leaveGathering = useMutation({
        mutationFn: async (id: number) => {
            if (!token) throw new Error('로그인이 필요합니다.');
            const response = await axios.delete(`/api/gatherings/leave?id=${id}`, { headers: { Authorization: `Bearer ${token}` } });
            return response.data;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['gatheringDetail', id] });
            queryClient.invalidateQueries({ queryKey: ['checkGatheringJoined'] });
            queryClient.invalidateQueries({ queryKey: ["joinedGatherings", token] });
            alert('참여 취소했습니다.');
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                onErrorCallback?.(serverError?.message || '에러가 발생했습니다.');
            } else {
                onErrorCallback?.(error.message);
            }
        }
    });

    return { leaveGathering: leaveGathering.mutate }
}