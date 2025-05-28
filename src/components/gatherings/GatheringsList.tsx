"use client"

import { useRouter } from "next/navigation";
import { useFetchInfiniteGatherings } from "@/hooks/gathering/useFetchInfiniteGatherings";
import { useGatheringsStore } from '@/store/gatheringsStore';
import { Gathering, GatheringsListProps } from "@/types/gatherings"; // 경로 변경
import { formatDate, formatTime, getTimeRemaining } from '@/components/shared/utils/format'; // format 함수 import
import { UserRoundCheck } from "lucide-react"
import Image from "next/image";
import SaveToggleButton from "@/components/gatherings/shared/ui/SaveToggleButton";
import JoinedCountsProgressBar from './shared/ui/JoinedCountsProgressBar';

export default function GatheringsList({
    fetchFromApi = true,
}: GatheringsListProps) {
    const router = useRouter();

    // 전역 상태: SSR 모임 목록
    const ssrGatherings = useGatheringsStore((s) => s.gatherings);

    // SSR 모임 목록 확인
    const hasSSRData = ssrGatherings.length > 0;

    const {
        infiniteGatherings,
        lastItemRef,
        isFetchingNextPage,
        infiniteScrollEnabled,
    } = useFetchInfiniteGatherings({
        enabled: fetchFromApi,
        hasSSRData,
    });

    // 전체 모임 데이터 합치기
    const mergedGatherings = (() => {
        const gatherings = [...ssrGatherings];

        if (hasSSRData && fetchFromApi && infiniteScrollEnabled) {
            gatherings.push(...infiniteGatherings);
        }

        return gatherings;
    })();

    // 최종 모임 목록
    const finalGatherings = fetchFromApi
        ? (hasSSRData ? mergedGatherings : [])  // 메인 페이지: SSR + 무한스크롤
        : ssrGatherings;                    // 찜목록: 전달받은 데이터 그대로

    const isInitialLoading = fetchFromApi && !hasSSRData;

    return (
        <div className="w-full flex flex-col justify-start gap-5">
            {/* 모임 목록 */}
            {!isInitialLoading && finalGatherings.map((gathering: Gathering, index: number) => {
                const isLastItem = index === finalGatherings.length - 1;

                return (
                    <section
                        role="button"
                        tabIndex={0}
                        key={`${gathering.teamId || 'unknown'}-${gathering.id}`}
                        onClick={() => router.push(`/gatherings/detail/${gathering.id}`)}
                        ref={isLastItem && hasSSRData && fetchFromApi ? lastItemRef : undefined}
                        className="w-full flex flex-col md:flex-row justify-start border border-gray-200 rounded-lg bg-white hover:border-main-300 hover:shadow-lg transition-all duration-300 overflow-hidden relative"
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
                            {/* 마감 시간 배지 */}
                            <div className="absolute top-3 left-3 bg-main-600 rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                                <Image src={"/icons/Alarm.svg"} alt="시간" width={16} height={16} />
                                <span className="text-sm font-medium text-white">
                                    {getTimeRemaining(gathering.registrationEnd)}
                                </span>
                            </div>
                        </div>

                        {/* 콘텐츠 영역 */}
                        <div className="flex-1 flex flex-col justify-between p-4 md:p-6 min-h-0">
                            {/* 상단 정보 */}
                            <div className="flex-1 w-full">
                                {/* 제목과 위치 */}
                                <div className="flex flex-row md:justify-between gap-3">
                                    <div className="flex-1 flex flex-row gap-2 items-center">
                                        <h1 className="text-lg font-semibold text-gray-900 -mt-6">{gathering.name}</h1>
                                        <div className="hidden sm:block w-[2px] h-[16px] bg-gray-900 -mt-6"></div>
                                        <p className="text-gray-700 text-sm font-medium -mt-6">{gathering.location}</p>
                                    </div>
                                    <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                                        <SaveToggleButton gatheringId={gathering.id.toString()} />
                                    </div>
                                </div>

                                {/* 날짜와 시간 */}
                                {gathering.dateTime && (
                                    <div className="flex flex-wrap gap-2 mb-3 -mt-3">
                                        <span className="inline-flex items-center px-3 py-1 bg-main-500 text-white text-sm font-medium rounded-md">
                                            {formatDate(gathering.dateTime)}
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 border-2 border-main-500 text-main-600 text-sm font-medium rounded-md">
                                            {formatTime(gathering.dateTime)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* 하단 정보 */}
                            <div className="flex flex-row items-center justify-between">
                                {/* 참여 인원 */}
                                <div className="flex items-center gap-2">
                                    <UserRoundCheck className='w-4 h-4 text-main-500' />
                                    <span className="text-gray-700 text-sm font-medium">
                                        {gathering.participantCount}/{gathering.capacity}
                                    </span>
                                </div>
                                <div className='w-full px-2'>
                                    <JoinedCountsProgressBar participantCount={gathering.participantCount} capacity={gathering.capacity} />
                                </div>
                            </div>
                        </div>
                    </section>
                );
            })}

            {/* 무한스크롤 로딩 */}
            {infiniteScrollEnabled && isFetchingNextPage && (
                <div className="w-full h-[80px] flex justify-center items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600 font-medium">더 많은 모임을 불러오는 중...</span>
                    </div>
                </div>
            )}

            {/* 빈 목록 */}
            {!isInitialLoading && finalGatherings.length === 0 && (
                <div className="w-full h-[100px] flex justify-center items-center border-2 border-gray-500">
                    <p className="text-gray-600 font-medium">아직 모임이 없어요</p>
                    <p className="text-gray-600 font-medium">지금 바로 모임을 만들어보세요</p>
                </div>
            )}
        </div>
    );
}