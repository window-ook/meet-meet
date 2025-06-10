import { Metadata } from 'next';
import { serverFetcher } from '@/lib/api/serverFetcher';
import { Gathering } from "@/types/gatherings";
import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import Gatherings from "@/components/gatherings/GatheringsUI";

export const metadata: Metadata = {
    title: `모임 찾기 | Meet Meet`,
    description: `모임 찾기 페이지 입니다`,
};

/**
 * 모임 조회 함수 - URL 파라미터 기반
 * @param searchParams URL 파라미터
 * @param mainType 모임 주제
 * @param location 위치
 * @param date 날짜
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 * @returns 모임 목록
 */
async function getFilteredGatherings(searchParams: {
    mainType?: string;
    location?: string;
    date?: string;
    sortBy?: string;
    sortOrder?: string;
}): Promise<Gathering[]> {
    try {
        const {
            mainType = 'DALLAEMFIT',
            location = '',
            date = '',
            sortBy = 'registrationEnd',
            sortOrder = 'desc'
        } = searchParams;

        // 쿼리 파라미터 구성
        const params = new URLSearchParams({
            limit: '10',
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

        // 날짜 필터
        if (date?.trim() && /^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
            params.set('date', date.trim());
        }

        const data = await serverFetcher(`${EXTERNAL_PATHS.GATHERINGS}?${params.toString()}`);

        if (Array.isArray(data)) {
            // DALLAEMFIT의 경우 서브타입 필터링만 유지
            if (mainType === 'DALLAEMFIT') {
                return data.filter((gathering: Gathering) =>
                    gathering.type === 'OFFICE_STRETCHING' ||
                    gathering.type === 'MINDFULNESS'
                );
            }
            
            return data;
        } else {
            console.warn('응답이 배열이 아닙니다:', data);
            return [];
        }
    } catch (error) {
        console.error('SSR 에러:', error);
        return [];
    }    
}

/**
 * 모임 찾기 페이지
 * @param searchParams URL 파라미터
 * @returns 모임 찾기 페이지
 */
export default async function GatheringsPage({
    searchParams
}: {
    searchParams: Promise<{
        mainType?: string;
        location?: string;
        date?: string;
        sortBy?: string;
        sortOrder?: string;
    }>
}) {
    // searchParams를 await로 처리
    const params = await searchParams;
    const ssrGatherings = await getFilteredGatherings(params);

    return (
        <div className="contents-container">
            <Gatherings 
                ssrGatherings={ssrGatherings}
                initialFilters={{
                    mainType: params.mainType || 'DALLAEMFIT',
                    location: params.location || '',
                    date: params.date || '',
                    sortBy: params.sortBy || 'registrationEnd',
                    sortOrder: params.sortOrder || 'desc'
                }}
            />
        </div>
    );
}