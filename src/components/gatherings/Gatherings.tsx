"use client"

import { useContext, useEffect, useState, useCallback } from "react";
import { Gathering } from "@/types/gatherings";
import { useGatheringsStore } from '@/store/gatheringsStore';
import CreateMeetingModal from "@/components/gatherings/CreateGatheringDialog";
import GatheringsList from "@/components/gatherings/GatheringsList";
import { AuthContext } from "@/providers/AuthProvider";
import GatheringFilters from "./shared/ui/GatheringsFilters";
import GatheringsHeader from "./shared/ui/GatheringsHeader";
import LocationDateFilter from "./shared/ui/LocationDateFilter";

interface PageProps {
    initialGatherings?: Gathering[];
}

interface Filters {
    location: string;
    date: string;
    sortOrder?: 'asc' | 'desc';
}

export default function Gatherings({ initialGatherings = [] }: PageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMainType, setSelectedMainType] = useState('DALLAEMFIT');
    const [selectedSubType, setSelectedSubType] = useState('ALL');
    const [filters, setFilters] = useState<Filters>({ 
        location: '', 
        date: '',
        sortOrder: 'asc'
    });
    const { token } = useContext(AuthContext);
    
    const isLoggedIn = !!token;
    const setGatherings = useGatheringsStore((state) => state.setGatherings);
    
    useEffect(() => {
        if (initialGatherings.length > 0) {
            setGatherings(initialGatherings);
        }
    }, [initialGatherings, setGatherings]);

    const openModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleTypeChange = useCallback((mainType: string, subType: string) => {
        setSelectedMainType(mainType);
        setSelectedSubType(subType);
    }, []);

    const handleFilterChange = useCallback((newFilters: Filters) => {
        setFilters(prev => {
            if (
                prev.location === newFilters.location && 
                prev.date === newFilters.date &&
                prev.sortOrder === newFilters.sortOrder
            ) {
                return prev;
            }
            return newFilters;
        });
    }, []);

    return (
        <>
            {isModalOpen && (
                <CreateMeetingModal 
                    onClose={closeModal}
                />
            )}
            <div className="w-full flex flex-col">
                <GatheringsHeader type="search" />
                <div className="w-full flex flex-col">
                    {/* 모임 주제 선택 및 모임 만들기 */}
                    <GatheringFilters 
                        showCreateButton={isLoggedIn}
                        onCreateClick={openModal}
                        onTypeChange={handleTypeChange}
                        initialMainType={selectedMainType}
                        initialSubType={selectedSubType}
                    />
                    {/* 위치 및 날짜 필터 */}
                    <LocationDateFilter 
                        onFilterChange={handleFilterChange}
                        pageType="search"
                    />
                </div>
                {/* 모임 목록 조회 */}
                <GatheringsList
                    fetchFromApi={true}
                    selectedMainType={selectedMainType}
                    selectedSubType={selectedSubType}
                    location={filters.location}
                    date={filters.date}
                    sortOrder={filters.sortOrder}
                />
            </div>
        </>
    );
}