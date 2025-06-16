/**
 * 모임 쿼리
 * @method all 모임 쿼리 전체
 */
export const gatheringsQuery = {
    all: () => ['gatherings'] as const,
    infinite: (
        mainType?: string,
        location?: string,
        date?: string,
        sortBy?: string,
        sortOrder?: string,
        startIndex?: number,
        filterSavedIds?: string
    ) => [...gatheringsQuery.all(), { mainType, location, date, sortBy, sortOrder, startIndex, filterSavedIds }] as const,
}

/**
 * 모임 상세 쿼리
 * @method information 모임 상세 쿼리
 * @method reviews 모임 상세 리뷰 쿼리
 * @method checkJoined 모임 참여 여부 쿼리
 */
export const gatheringDetailQuery = {
    detail: (id: string | number) => ['gatheringDetail', id],
    reviews: (id: string | number) => ['gatheringReviews', id],
    checkJoined: (id: string | number) => ['checkGatheringJoined', id],
}