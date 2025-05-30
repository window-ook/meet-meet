'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

import { Category } from '@/types/tabFilters';
import { useToggleSavedGatherings } from '@/hooks/api/useToggleSavedGatherings';
import { useGatheringsStore } from '@/store/gatheringsStore'; // ✅ Zustand import
import GatheringsList from '@/components/gatherings/GatheringsList';
import GatheringsCategoryTabs from '@/components/gatherings/shared/ui/GatheringsCategoryTabs';
import GatheringsFilterTabs from '@/components/gatherings/shared/ui/GatheringsFilterTabs';
import { filterGatherings } from '@/components/gatherings/shared/utils/filterGatherings';
import { useTabFilter } from '@/hooks/api/useTabFilter';

const ITEMS_PER_PAGE = 10;

export default function LikeMeetingsPage() {
  const { savedIds: likedList } = useToggleSavedGatherings();
  const allGatherings = useGatheringsStore((s) => s.gatherings); 

  const {
    filter,
    selectedLocation,
    selectedDate,
    sortBy,
    handleCategoryChange,
    handleTypeChange,
  } = useTabFilter();

  const filterState = {
    category: filter.category,
    type: filter.type,
    selectedLocation,
    selectedDate,
    sortBy,
  };

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const filteredGatherings = filterGatherings(allGatherings, likedList, filterState);
  const visibleGatherings = filteredGatherings.slice(0, visibleCount);

  useEffect(() => {
    if (visibleCount >= filteredGatherings.length) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => prev + ITEMS_PER_PAGE);
        }
      },
      { threshold: 1 }
    );

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [visibleCount, filteredGatherings.length]);

  return (
    <main className="contents-container">
      <div className="flex w-full flex-col">
        {/* 상단 헤더 */}
        <div className="flex w-full flex-row items-center justify-between pt-10">
          <Image
            src="/icons/saved-logo.svg"
            alt="찜 아이콘"
            width={70}
            height={70}
            className="pointer-events-none mr-1 rounded-full border-2 border-black"
            priority
          />
          <div className="flex w-full flex-col justify-start px-2">
            <p className="mb-2 text-sm font-medium text-[#374151]">찜한 모임</p>
            <p className="text-lg font-semibold text-gray-900">
              마감되기 전에 지금 바로 참여해보세요 👀
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col justify-start py-5">
          <GatheringsCategoryTabs
            selected={filter.category}
            onChange={handleCategoryChange}
          />
          {filter.category === Category.DALLAEMFIT && (
            <GatheringsFilterTabs
              selected={filter.type}
              onChange={handleTypeChange}
            />
          )}
        </div>
      </div>

      {/* 모임 카드 목록 */}
      <GatheringsList
        fetchFromApi={false}
        gatherings={visibleGatherings}
      />
    </main>
  );
}
