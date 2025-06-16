/**
 * 찜한 모임 쿼리
 * @method all 찜한 모임 쿼리 전체
 * @method idsByFilter 특정 ID들에 해당하는 찜한 모임 쿼리
 */
export const savedQueries = {
    all: () => ['savedGatherings'] as const,
    idsByFilter: (ids: string[]) => [...savedQueries.all(), ids] as const,
};

/**
 * 누적된 찜한 모임 쿼리
 * @method all 누적된 찜한 모임 쿼리 전체
 * @method idsByFilter 특정 ID들에 해당하는 누적된 찜한 모임 쿼리
 */
export const allSavedQueries = {
    all: () => ['allSavedGatherings'] as const,
    idsByFilter: (ids: string[]) => [...allSavedQueries.all(), ids] as const,
}
