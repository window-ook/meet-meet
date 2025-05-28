import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface UseJoinGatheringProps {
    token: string | null;
    onErrorCallback?: (msg: string) => void;
}

/** 리뷰 생성 훅
* @param token 토큰
* @param onErrorCallback 에러 콜백 함수 (모달에 표시할 메세지를 전달 받음)
* @returns {function} joinGathering - 모임 참가 함수
*/
export const useCreateReview = ({ token, onErrorCallback }: UseJoinGatheringProps) => {
    const queryClient = useQueryClient();

    const joinGathering = useMutation({
        mutationFn: async () => {
            if (!token) throw new Error('로그인이 필요합니다.');
            const response = await axios.post(`/api/reviews`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myReviewGatherings", token] });
            alert('리뷰 작성 완료')
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

    return { joinGathering: joinGathering.mutate }
}