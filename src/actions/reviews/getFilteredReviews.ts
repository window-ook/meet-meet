import { serverFetcher } from '@/lib/api/serverFetcher';
import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import { ReviewItem, Reviews } from "@/types/reviews";

const SSR_REVIEW_LIMIT = 3;
const DATE_REGEX_PATTERN = /^\d{4}-\d{2}-\d{2}$/; // 날짜 패턴

/**
 * 리뷰 조회 함수 - URL 파라미터 기반
 * @param searchParams URL 파라미터
 * @param mainType 모임 주제
 * @param location 위치
 * @param date 날짜
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 * @returns 리뷰 목록
 */
export async function getFilteredReviews(searchParams: {
    mainType?: string;
    location?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: string;
}): Promise<ReviewItem[]> {
    try {
        const {
            mainType = 'DALLAEMFIT',
            location = '',
            date = '',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = searchParams;

        // 쿼리 파라미터 구성
        const params = new URLSearchParams({
            limit: SSR_REVIEW_LIMIT.toString(),
            offset: '0',
            sortBy,
            sortOrder
        });

        // mainType에 따른 type 설정
        if (mainType === 'DORANDORAN') {
            params.set('type', 'WORKATION');
        } else {
            params.set('type', 'DALLAEMFIT');
        }

        // 위치 필터
        if (location?.trim()) {
            params.set('location', location.trim());
        }

        // 날짜 필터 (서버에서 처리)
        if (date?.trim() && DATE_REGEX_PATTERN.test(date.trim())) {
            params.set('date', date.trim());
        }

        const data = await serverFetcher<Reviews>(`${EXTERNAL_PATHS.REVIEWS}?${params.toString()}`, {
            cache: 'no-store'
        });

        // 응답 데이터 구조 확인
        let reviews: ReviewItem[] = [];
        if (Array.isArray(data)) {
            reviews = data;
        } else if (data?.data) {
            reviews = data.data;
        } else {
            console.warn('응답이 예상 구조가 아닙니다:', data);
            return [];
        }

        return reviews;

    } catch (error) {
        console.error('리뷰 SSR 에러:', error);
        return [];
    }
}
