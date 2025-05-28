import { useGatheringsStore } from '@/store/gatheringsStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface UseCancelGatheringProps {
    token: string | null;
    onErrorCallback?: (msg: string) => void;
}

/** 모임 삭제 훅
* @param token 토큰
* @param onErrorCallback 에러 콜백 함수 (모달에 표시할 메세지를 전달 받음)
* @returns {function} cancelGathering - 모임 삭제 함수
*/
export const useCancelGathering = ({ token, onErrorCallback }: UseCancelGatheringProps) => {
    const queryClient = useQueryClient();
    const removeGathering = useGatheringsStore((s) => s.removeGathering);

    const cancelGathering = useMutation({
        mutationFn: async (id: number) => {
            if (!token) throw new Error('로그인이 필요합니다.');
            await axios.put(`/api/gatherings/cancel?id=${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            return id;
        },
        onSuccess: (id) => {
            removeGathering(id);
            queryClient.invalidateQueries({ queryKey: ['gatherings', 'infinite'] });
            alert('모임을 삭제했습니다.');
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

    return { cancelGathering: cancelGathering.mutate }
}