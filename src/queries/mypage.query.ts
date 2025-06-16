/**
 * 마이페이지 쿼리
 * @method joinedGatherings 참여중인 모임 쿼리
 * @method myReviews 나의 리뷰 쿼리
 * @method createdGatherings 내가 만든 모임 쿼리
 */
export const myPageQuery = {
    joinedGatherings: (token: string) => ['joinedGatherings', token] as const,
    myReviews: (token: string) => ['myReviews', token] as const,
    createdGatherings: (token: string) => ['createdGatherings', token] as const,
}