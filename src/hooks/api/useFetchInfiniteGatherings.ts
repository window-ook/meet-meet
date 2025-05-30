'use client';

import { useState, useRef, useCallback, useContext } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchGatheringsPaginated } from '@/components/gatherings/shared/utils/fetch';
import { AuthContext } from '@/providers/AuthProvider';

interface UseFetchInfiniteGatheringsProps {
    enabled: boolean;
    hasSSRData: boolean;
}

/**
 * 무한스크롤 훅
 * @param enabled 무한스크롤 활성화 여부
 * @param hasSSRData SSR 데이터 존재 여부
 * @returns 
 */
export const useFetchInfiniteGatherings = ({ enabled, hasSSRData }: UseFetchInfiniteGatheringsProps) => {
    const { token } = useContext(AuthContext);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState(false);

    // 무한스크롤 쿼리
    const {
        data: infiniteData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error
    } = useInfiniteQuery({
        queryKey: ['gatherings', 'infinite'],
        queryFn: ({ pageParam = 2 }) => {
            return fetchGatheringsPaginated(pageParam, 10, token || '');
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage || lastPage.length < 5) {
                return undefined;
            }
            const nextPage = allPages.length + 2;
            return nextPage;
        },
        initialPageParam: 2,
        enabled: infiniteScrollEnabled && enabled && hasSSRData,
        refetchOnWindowFocus: false,
    });

    // Intersection Observer를 사용한 무한스크롤 트리거
    const lastItemRef = useCallback((node: HTMLDivElement | null) => {
        if (!enabled || !hasSSRData) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (!infiniteScrollEnabled) {
                    setInfiniteScrollEnabled(true);
                } else if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            }
        }, {
            threshold: 0.1,
            rootMargin: '5px'
        });

        if (node) {
            observerRef.current.observe(node);
        }
    }, [enabled, hasSSRData, infiniteScrollEnabled, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // 무한스크롤로 불러온 모든 데이터 합치기
    const infiniteGatherings = infiniteScrollEnabled && infiniteData?.pages
        ? infiniteData.pages.flat()
        : [];

    return {
        infiniteGatherings,
        lastItemRef,
        isFetchingNextPage,
        infiniteScrollEnabled,
        hasNextPage,
        isLoading,
        error
    };
};