"use client"

import { useState, useEffect, useCallback } from 'react';
import { ArrowUpDown } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface LocationDateFilterProps {
    onFilterChange: (filters: { 
        location: string; 
        date: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) => void;
    initialLocation?: string;
    initialDate?: string;
    pageType?: 'search' | 'review';
}

// 위치 및 날짜 필터
export default function LocationDateFilter({
    onFilterChange,
    initialLocation = '',
    initialDate = '',
    pageType = 'search'
}: LocationDateFilterProps) {
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate ? new Date(initialDate) : null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleLocationChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLocation(e.target.value);
    }, []);

    const handleDateChange = useCallback((date: Date | null) => {
        if (date) {
            // 로컬 시간 기준으로 YYYY-MM-DD 형식 생성 (시간대 변환 없이)
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;
            
            setSelectedDate(date);
            
            // 부모 컴포넌트에 로컬 날짜 문자열 전달
            onFilterChange({
                location: selectedLocation,
                date: dateString,
                ...(pageType === 'search' && {
                    sortBy: 'registrationEnd',
                    sortOrder
                })
            });
        } else {
            setSelectedDate(null);
            onFilterChange({
                location: selectedLocation,
                date: '',
                ...(pageType === 'search' && {
                    sortBy: 'registrationEnd',
                    sortOrder
                })
            });
        }
    }, [selectedLocation, pageType, sortOrder, onFilterChange]);
    
    // useEffect로 필터 변경 처리
    useEffect(() => {
        if (selectedDate) {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;
            
            onFilterChange({
                location: selectedLocation,
                date: dateString,
                ...(pageType === 'search' && {
                    sortBy: 'registrationEnd',
                    sortOrder
                })
            });
        } else {
            onFilterChange({
                location: selectedLocation,
                date: '',
                ...(pageType === 'search' && {
                    sortBy: 'registrationEnd',
                    sortOrder
                })
            });
        }
    }, [selectedLocation, selectedDate, sortOrder, pageType, onFilterChange]);

    const handleSortToggle = useCallback(() => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    }, []);

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            {/* 위치 필터 */}
            <div className="flex items-center border rounded-lg px-3 py-2 bg-white hover:border-gray-400 transition-colors min-w-0">
                <div className="relative flex-1 min-w-[100px] max-w-[120px]">
                    <select
                        value={selectedLocation}
                        onChange={handleLocationChange}
                        className="border-none outline-none bg-transparent text-sm text-gray-700 cursor-pointer w-full appearance-none pr-2"
                    >
                        <option value="">지역 전체</option>
                        <option value="을지로3가">을지로3가</option>
                        <option value="건대입구">건대입구</option>
                        <option value="신림">신림</option>
                        <option value="홍대입구">홍대입구</option>
                    </select>
                    {/* 커스텀 드롭다운 화살표 */}
                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* 날짜 필터 */}
            <div className="flex items-center border rounded-lg px-3 py-2 bg-white hover:border-gray-400 transition-colors min-w-0">
                <div className="relative flex-1 min-w-[110px] max-w-[120px]">
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        className="border-none outline-none bg-transparent text-sm text-gray-700 cursor-pointer w-full"
                        placeholderText="날짜 선택"
                        isClearable
                        minDate={new Date()}
                        calendarClassName="custom-datepicker"
                        popperClassName="react-datepicker-popper"
                        popperProps={{
                            strategy: "fixed"
                        }}
                        renderCustomHeader={({
                            date,
                            decreaseMonth,
                            increaseMonth,
                            prevMonthButtonDisabled,
                            nextMonthButtonDisabled,
                        }) => (
                            <div className="flex items-center justify-between px-4">
                                <button
                                    onClick={decreaseMonth}
                                    disabled={prevMonthButtonDisabled}
                                    className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="button"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="15,18 9,12 15,6"></polyline>
                                    </svg>
                                </button>
                                <div className="font-semibold text-gray-800 text-base">
                                    {date.toLocaleDateString('ko-KR', { 
                                        year: 'numeric', 
                                        month: 'long' 
                                    })}
                                </div>
                                <button
                                    onClick={increaseMonth}
                                    disabled={nextMonthButtonDisabled}
                                    className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="button"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="9,18 15,12 9,6"></polyline>
                                    </svg>
                                </button>
                            </div>
                        )}
                    />
                </div>
            </div>

            {/* 정렬 버튼 */}
            <div className="ml-auto">
                {pageType === 'search' && (
                    <button
                        onClick={handleSortToggle}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                            sortOrder === 'asc' 
                                ? 'bg-main-500 text-white border-main-500 hover:bg-main-600' 
                                : 'bg-main-500 text-white border-main-500 hover:bg-main-600'
                        }`}
                        title={`마감일 ${sortOrder === 'asc' ? '빠른순' : '늦은순'}으로 정렬`}
                    >
                        <ArrowUpDown className="w-4 h-4" />
                        <span className="hidden sm:inline">
                            마감일 {sortOrder === 'asc' ? '빠른순' : '늦은순'}
                        </span>
                        <span className="sm:hidden">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}