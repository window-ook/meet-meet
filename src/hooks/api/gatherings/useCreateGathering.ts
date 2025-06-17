'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GatheringApiParams } from '@/types/gatheringApi';
import { internalClient } from '@/lib/api/clientFetchers';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { AxiosError } from 'axios';
import { isErrorResponse } from '@/lib/api/surfGuard';
import { gatheringsQuery } from '@/queries/gatherings.query';
import { myPageQuery } from '@/queries/mypage.query';

/**
 * 모임 생성 훅
* @param token 토큰
* @param onCallback 모달에 표시할 메세지를 전달
 * @returns {function} createGathering - 모임 생성 함수
 */
export const useCreateGathering = ({ token, onCallback }: GatheringApiParams) => {
    const queryClient = useQueryClient();

    const createGathering = useMutation({
        mutationFn: async (formData: FormData) => {
            if (!token) throw new Error('로그인이 필요합니다.');
            const response = await internalClient.post(INTERNAL_PATHS.GATHERINGS, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gatheringsQuery.all() });
            queryClient.invalidateQueries({ queryKey: myPageQuery.createdGatherings(token!) });
            onCallback?.('모임을 생성했습니다');
        },
        onError: (error) => {
            const err = error as AxiosError;
            const message = (isErrorResponse(err?.response?.data) && err?.response?.data.message) || '모임 생성에 실패했습니다';
            onCallback?.(message);
        }
    });

    return { createGathering: createGathering.mutate }
}