import { create } from 'zustand';
import { Reviews } from '@/types/reviews';

/**
 * SSR 모임 상세 리뷰 목록
 * @type {Reviews} detailReviews 모임 상세 리뷰 목록
 * @type {function} setDetailReviews 모임 상세 리뷰 목록 설정 함수
 * */
interface DetailReviewsState {
    detailReviews: Reviews;
    setDetailReviews: (detailReviews: Reviews) => void;
}

export const useDetailReviewsStore = create<DetailReviewsState>((set) => ({
    detailReviews: {
        data: [],
        totalItemCount: 0,
        currentPage: 0,
        totalPages: 0,
    },
    setDetailReviews: (detailReviews: Reviews) =>
        set((state) => ({
            detailReviews: {
                data: state.detailReviews.data.concat(detailReviews.data),
                totalItemCount: detailReviews.totalItemCount,
                currentPage: detailReviews.currentPage,
                totalPages: detailReviews.totalPages,
            },
        })),
}));