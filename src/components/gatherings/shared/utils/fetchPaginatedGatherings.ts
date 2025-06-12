import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { internalClient } from '@/lib/api/clientFetchers';
import { Gathering } from "@/types/gatherings";
import { isSameDateForFilter } from '@/components/shared/utils/dateFormats';
import { buildGatheringParams, normalizeGatheringsResponse, handleGatheringsError, filterGatheringsByMainType } from '@/components/gatherings/shared/utils/gatheringsUtils';

/**
 * 페이지네이션된 모임 목록 조회
 * @param page 페이지 번호
 * @param mainType 모임 주제
 * @param location 위치
 * @param date 날짜
 * @param filterSavedIds 찜목록 필터링
 * @param sortBy 정렬 기준
 * @param sortOrder 정렬 순서
 * @param limit 가져올 개수 (기본값 10)
 */
export async function fetchPaginatedGatherings(
    page: number,
    mainType: string = 'DALLAEMFIT',
    location?: string,
    date?: string,
    filterSavedIds?: string[],
    sortBy: string = 'registrationEnd',
    sortOrder: string = 'desc',
    limit: number = 10
): Promise<Gathering[]> {
    try {
        // 파라미터 생성
        const params = buildGatheringParams({
            limit,
            offset: page * limit,
            mainType,
            location,
            sortBy,
            sortOrder
            // date는 별도 처리
        });

        // API 요청
        const response = await internalClient.get(INTERNAL_PATHS.GATHERINGS, {
            params: Object.fromEntries(params)
        });

        // 응답 정규화
        const gatherings = normalizeGatheringsResponse(response);

        // 날짜 필터링
        let dateFilteredGatherings = gatherings;
        if (date && date.trim() !== '') {
            const targetDate = date.trim();
            dateFilteredGatherings = gatherings.filter((gathering: Gathering) => {
                if (!gathering.dateTime) return false;
                return isSameDateForFilter(gathering.dateTime, targetDate);
            });
        }

        // 메인타입 필터링
        const typeFilteredGatherings = filterGatheringsByMainType(dateFilteredGatherings, mainType);

        // 찜한 모임 필터링
        let finalGatherings = typeFilteredGatherings;
        if (filterSavedIds && filterSavedIds.length > 0) {
            finalGatherings = typeFilteredGatherings.filter((gathering: Gathering) =>
                filterSavedIds.includes(gathering.id.toString())
            );
        }

        return finalGatherings;
    } catch (error) {
        return handleGatheringsError(error, 'fetchPaginatedGatherings');
    }
}