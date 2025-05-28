import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/** 
 * 모임 리뷰 목록 조회 커스텀 훅
 * @param id
 * @returns {data, isLoading, isError}
 */
export const useGatheringReviewQuery = (
    id: number
) => {
    const fetchGatheringReviews = async (id: number) => {
        try {
            const response = await axios.get(`/api/gatherings/detail/reviews?id=${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                console.error(serverError?.message);
            }
        }
    }

    const { data, isLoading, isError } = useQuery({
        enabled: !!id,
        queryKey: ['gatheringDetailReviews', id],
        queryFn: () => fetchGatheringReviews(id),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    })

    return { data, isLoading, isError }
}