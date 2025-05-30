'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface WriteReviewParams {
    gatheringId: number;
    score: number;
    comment: string;
    token: string;
}

export const useWriteReview = (onSuccessCallback: () => void) => {
    const queryClient = useQueryClient();

    const writeReview = useMutation({
        mutationFn: async ({ gatheringId, score, comment, token }: WriteReviewParams) => {
            if (!token) throw new Error('로그인이 필요합니다.');
            const response = await axios.post(`/api/reviews`, { gatheringId, score, comment }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myGatheringReviews'] });
            alert('리뷰가 성공적으로 등록되었습니다.');
            onSuccessCallback();
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                alert(serverError?.message || '리뷰 등록에 실패했습니다.');
            } else {
                alert(error.message);
            }
        }
    });

    return { mutateWriteReview: writeReview.mutate }
}