"use client"

import { useRouter } from "next/navigation";
import { useFetchInfiniteGatherings } from "@/hooks/api/gatherings/useFetchInfiniteGatherings";
import { useMemo } from 'react';
import { formatDate, formatTime } from '@/components/shared/utils/dateFormats';
import { Gathering } from "@/types/gatherings";
import { UserRoundCheck } from "lucide-react";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { filterGatheringsByType, getUniqueGatherings } from '@/components/gatherings/shared/utils/gatheringsUtils';

const JoinedCountsProgressBar = dynamic(() => import('@/components/gatherings/shared/ui/JoinedCountsProgressBar'), { ssr: false });
const SaveToggleButton = dynamic(() => import('@/components/gatherings/shared/ui/SaveToggleButton'), { ssr: false });
const DateReminder = dynamic(() => import('@/components/shared/ui/DateReminder'), { ssr: false });

/**
 * 모임 목록 컴포넌트
 * @param ssrGatherings 서버 렌더링 모임 목록
 * @param activeStartIndex 첫 진행중 모임의 전체 인덱스
 * @param selectedMainType 선택된 메인 타입
 * @param selectedSubType 선택된 서브 타입
 * @param filters 필터 상태
 * @param sort 정렬 상태
 * @param enableInfiniteScroll 무한 스크롤 활성화 여부
 * @param savedGatheringIds 저장된 모임 ID 목록
 */
interface GatheringsListProps {
    ssrGatherings: Gathering[];
    activeStartIndex: number;
    selectedMainType: string;
    selectedSubType: string;
    filters: {
        location: string;
        date: string;
    };
    sort: {
        sortBy: string;
        sortOrder: string;
    };
    enableInfiniteScroll?: boolean;
    savedGatheringIds?: string[];
}

/**
 * 제목 자르기
 * @param title 제목
 * @param maxLength 최대 길이
 * @returns 자른 제목
 */
const truncateTitle = (title: string, maxLength: number = 20): string => {
    if (!title) return '';
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
};

export default function GatheringsList({
    ssrGatherings,
    activeStartIndex,
    selectedMainType,
    selectedSubType,
    filters,
    sort,
    enableInfiniteScroll = true,
    savedGatheringIds = [],
}: GatheringsListProps) {
    const router = useRouter();
    const isSavedPage = savedGatheringIds.length > 0;

    // CSR 시작 인덱스를 정확하게 계산
    // SSR이 진행중 모임 10개를 수집했으므로, CSR은 진행중 모임의 11번째부터 시작
    const csrStartIndex = useMemo(() => {
        if (ssrGatherings.length === 0) {
            return activeStartIndex; // SSR이 아무것도 수집하지 못했으면 activeStartIndex부터
        }
        
        // CSR은 SSR이 수집한 개수만큼 건너뛰고 시작
        // activeStartIndex는 전체 데이터에서의 절대 인덱스
        // CSR은 activeStartIndex + SSR수집개수 부터 시작
        const calculatedIndex = activeStartIndex + ssrGatherings.length; // 정확히 계산된 인덱스 전달
        
        return calculatedIndex;
    }, [activeStartIndex, ssrGatherings.length]);

    const {
        infiniteGatherings,
        lastItemRef,
        isFetchingNextPage,
        isLoading,
    } = useFetchInfiniteGatherings({
        enabled: enableInfiniteScroll && !isSavedPage,
        mainType: selectedMainType,
        location: filters.location,
        date: filters.date,
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
        startIndex: csrStartIndex, // 계산된 인덱스 전달
    });

    // SSR 데이터 서브타입 필터링
    const filteredSSRGatherings = useMemo(() => {
        return filterGatheringsByType(ssrGatherings, selectedMainType, selectedSubType);
    }, [ssrGatherings, selectedMainType, selectedSubType]);

    // CSR 데이터 서브타입 필터링
    const filteredCSRGatherings = useMemo(() => {
        // 찜 페이지에서는 서브타입 필터링 안함
        if (isSavedPage) {
            return [];
        }

        return filterGatheringsByType(infiniteGatherings, selectedMainType, selectedSubType);
    }, [infiniteGatherings, selectedMainType, selectedSubType, isSavedPage]);

    // 최종 모임 목록
    const allGatherings = useMemo(() => {
        // 찜 페이지에서는 SSR 데이터만 사용
        if (isSavedPage) {
            return filteredSSRGatherings;
        }

        // 일반 모임찾기에서는 SSR + CSR 결합
        const uniqueCSRGatherings = getUniqueGatherings(filteredCSRGatherings, filteredSSRGatherings);
        return filteredSSRGatherings.concat(uniqueCSRGatherings);
    }, [filteredSSRGatherings, filteredCSRGatherings, isSavedPage]);

    return (
        <div className="w-full flex flex-col justify-start gap-5">
            {/* 진행중 모임들만 렌더링 */}
            {allGatherings.map((gathering: Gathering, index: number) => {
                const isLastItem = index === allGatherings.length - 1;

                return (
                    <section
                        role="button"
                        tabIndex={0}
                        key={`${gathering.teamId || 'unknown'}-${gathering.id}-${index}`}
                        onClick={() => router.push(`/gatherings/detail/${gathering.id}`)}
                        ref={isLastItem && !isFetchingNextPage && enableInfiniteScroll && !isSavedPage ? lastItemRef : undefined}
                        className="w-full flex flex-col md:flex-row justify-start border border-gray-200 rounded-2xl bg-white hover:border-main-300 hover:shadow-lg transition-all duration-300 overflow-hidden relative cursor-pointer"
                    >
                        {/* 이미지 영역 */}
                        <div className="w-full md:w-80 h-48 md:h-40 relative flex-shrink-0">
                            <Image
                                src={gathering.image}
                                alt="모임 이미지"
                                fill
                                className="rounded-t-lg md:rounded-l-lg md:rounded-t-none object-cover pointer-events-none"
                                priority={index === 0}
                                sizes="(max-width: 768px) 100vw, 320px"
                            />
                            <DateReminder registrationEnd={gathering.registrationEnd} />
                        </div>

                        {/* 콘텐츠 영역 */}
                        <div className="flex-1 flex flex-col justify-between p-4 md:p-6 min-h-0">
                            {/* 상단 영역 */}
                            <div className="flex-1 w-full">
                                {/* 제목과 위치 */}
                                <div className="flex flex-row md:justify-between gap-3">
                                    <div className="flex-1 flex flex-row gap-2 items-center">
                                        <h1 className="text-lg font-semibold -mt-6 text-gray-900">
                                            {truncateTitle(gathering.name)}
                                        </h1>
                                        <div className="hidden sm:block w-[2px] h-[16px] -mt-6 bg-gray-900"></div>
                                        <p className="text-sm font-medium -mt-6 text-gray-700">
                                            {gathering.location}
                                        </p>
                                    </div>
                                    <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                                        <SaveToggleButton gatheringId={gathering.id.toString()} />
                                    </div>
                                </div>

                                {/* 날짜와 시간 */}
                                {gathering.dateTime && (
                                    <div className="flex flex-wrap gap-2 mb-3 -mt-3">
                                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md bg-main-500 text-white">
                                            {formatDate(gathering.dateTime)}
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 border-2 text-sm font-medium rounded-md border-main-500 text-main-600">
                                            {formatTime(gathering.dateTime)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* 하단 영역 */}
                            <div className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <UserRoundCheck className="w-4 h-4 text-main-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {gathering.participantCount}/{gathering.capacity}
                                    </span>
                                </div>
                                <div className='w-full px-2'>
                                    <JoinedCountsProgressBar
                                        participantCount={gathering.participantCount}
                                        capacity={gathering.capacity}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                );
            })}

            {/* 무한스크롤 로딩 */}
            {isLoading && enableInfiniteScroll && isFetchingNextPage && (
                <div className="w-full h-[80px] flex justify-center items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-3 border-main-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600 font-medium">더 많은 모임을 불러오는 중...</span>
                    </div>
                </div>
            )}

            {/* 빈 목록 메시지 */}
            {!isLoading && allGatherings.length === 0 && (
                <div className="w-full h-[300px] flex flex-col justify-center items-center text-gray-500 font-medium text-sm">
                    <p className="text-lg font-semibold mb-2">아직 모임이 없어요</p>
                    <p>곧 새로운 모임이 열릴 예정이에요</p>
                </div>
            )}
        </div>
    );
}