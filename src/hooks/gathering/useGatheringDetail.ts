import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

/** 
 * 모임 상세 조회 커스텀 훅
 * @param id
 * @returns {data, isLoading, isError}
 */
export default function useGatheringDetail(
    id: number
) {
    const queryClient = useQueryClient();

    const fetchGatheringDetail = async (id: number) => {
        try {
            const response = await axios.get(`/api/gatherings/detail?id=${id}`);
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
        queryKey: ['gatheringDetail', id],
        queryFn: () => fetchGatheringDetail(id),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    })

    const retchIsSaved = useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gatheringDetail', id] });
        },
    });

    return { data, isLoading, isError, retchIsSaved }
}
