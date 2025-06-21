import { Reviews } from '@/types/reviews';
import { serverFetcher } from '@/lib/api/serverFetcher';
import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';

/**
 * 모임 상세 페이지의 리뷰 데이터 조회
 * @param id - 모임 ID
 * @returns 모임 리뷰 데이터
 */
export async function getDetailReview(id: string): Promise<Reviews> {
    try {
        const data = await serverFetcher<Reviews>(`${EXTERNAL_PATHS.fetchDetailReview(Number(id))}`);

        if (
            data &&
            Array.isArray(data.data) &&
            typeof data.totalItemCount === 'number' &&
            typeof data.currentPage === 'number' &&
            typeof data.totalPages === 'number'
        ) {
            return data as Reviews;
        } else {
            console.warn('응답이 Review 타입이 아닙니다:', data);
            return {
                data: [],
                totalItemCount: 0,
                currentPage: 0,
                totalPages: 0,
            };
        }
    } catch (error) {
        console.error('모임 리뷰 조회 Server Error:', error);
        return {
            data: [],
            totalItemCount: 0,
            currentPage: 0,
            totalPages: 0,
        };
    }
}
