"use client";

import { useState } from 'react';
import { useToggleSavedGatherings } from '@/hooks/api/saved/useToggleSavedGatherings';
import { useQuery } from '@tanstack/react-query';
import { internalClient } from '@/lib/api/clientFetchers';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { Gathering } from '@/types/gatherings';
import GatheringsList from '@/components/gatherings/GatheringsList';
import GatheringFilters from '@/components/gatherings/shared/ui/GatheringsFilters';
import GatheringsHeader from '@/components/gatherings/shared/ui/GatheringsHeader';

export default function SavedGatheringsClient() {
    const [selectedMainType, setSelectedMainType] = useState('DALLAEMFIT');
    const [selectedSubType, setSelectedSubType] = useState('ALL');

    // useToggleSavedGatherings 훅
    const { savedIds } = useToggleSavedGatherings();

    // 찜한 모임의 상세 데이터만 별도로 가져오기
    const { data: allSavedGatherings = [], isLoading } = useQuery({
        queryKey: ["allSavedGatherings", savedIds], // savedIds 자동 갱신
        queryFn: async () => {
            if (savedIds.length === 0) return [];

            try {
                const response = await internalClient.get(INTERNAL_PATHS.GATHERINGS, {
                    params: {
                        limit: 1000
                    }
                });

                // API 응답 구조 확인
                const gatherings = Array.isArray(response.data) 
                    ? response.data 
                    : response.data?.data || response.data?.gatherings || [];

                // 찜한 ID 목록을 기반으로 필터링
                const gatheringsMap = new Map(
                    gatherings.map((gathering: Gathering) => [gathering.id.toString(), gathering])
                );

                const orderedGatherings = savedIds
                    // 찜한 ID 목록을 기반으로 모임 데이터 가져오기
                    .map(id => gatheringsMap.get(id))
                    // 모임 데이터가 없는 경우 제외
                    .filter((gathering): gathering is Gathering => gathering !== undefined);

                return orderedGatherings;
            } catch (error) {
                console.error('찜한 모임 데이터 로드 실패:', error);
                return [];
            }
        },
        enabled: savedIds.length > 0, // savedIds가 있을 때만 실행
        retry: 2,
        refetchOnWindowFocus: false,
    });

    const handleTypeChange = (mainType: string, subType: string) => {
        setSelectedMainType(mainType);
        setSelectedSubType(subType);
    };

    return (
        <div className="w-full flex flex-col">
            <GatheringsHeader type="saved" />
            
            <GatheringFilters
                onTypeChange={handleTypeChange}
                initialMainType={selectedMainType}
                initialSubType={selectedSubType}
                showCreateButton={false} // 찜한 모임 페이지에서는 모임 만들기 버튼 숨김
            />
            
            <GatheringsList
                ssrGatherings={allSavedGatherings}
                selectedMainType={selectedMainType}
                selectedSubType={selectedSubType}
                filters={{ location: '', date: '' }} // 기본 필터 (찜한 모임에서는 위치/날짜 필터 사용 안함)
                sort={{ sortBy: 'registrationEnd', sortOrder: 'desc' }} // 기본 정렬
                enableInfiniteScroll={false} // 찜한 모임에서는 무한스크롤 비활성화
                savedGatheringIds={savedIds} // 찜한 모임 ID 목록 (선택사항)
            />

            {/* 찜한 모임이 없는 경우 안내 메시지 */}
            {!isLoading && savedIds.length === 0 && (
                <div className="w-full h-[400px] flex flex-col justify-center items-center text-gray-500 font-medium">
                    <h3 className="text-lg font-semibold mb-2">아직 찜한 모임이 없어요</h3>
                    <p className="text-sm text-center">
                        마음에 드는 모임을 찾아서<br />
                        하트 버튼을 눌러보세요!
                    </p>
                </div>
            )}

            {/* 로딩 상태 */}
            {isLoading && savedIds.length > 0 && (
                <div className="w-full h-[200px] flex justify-center items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-3 border-main-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600 font-medium">찜한 모임을 불러오는 중...</span>
                    </div>
                </div>
            )}
        </div>
    );
}