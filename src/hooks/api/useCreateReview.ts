'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface createReviewParams {
    gatheringId: number;
    score: number;
    comment: string;
    token: string;
}

/**
 * 나의 리뷰 생성 훅
 * @param onSuccessCallback 
 * @returns {function} mutateCreateMyReview - 리뷰 생성 함수
 */

export const useCreateReview = (onSuccessCallback: () => void) => {
    const queryClient = useQueryClient();

    const createReview = useMutation({
        mutationFn: async ({ gatheringId, score, comment, token }: createReviewParams) => {
            if (!token) throw new Error('로그인이 필요합니다.');
            const response = await axios.post(`/api/reviews`, { gatheringId, score, comment }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myGatheringReviews'] });
            queryClient.invalidateQueries({ queryKey: ["gatheringReviews"] });

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

    return { mutateCreateReview: createReview.mutate }
}