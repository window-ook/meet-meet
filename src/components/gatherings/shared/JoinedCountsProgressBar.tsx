'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import * as m from "motion/react-m";

export default function JoinedCountsProgressBar({
    participantCount,
    capacity
}: {
    participantCount: number;
    capacity: number;
}) {
    const pathname = usePathname();

    const isDetailPage = pathname.includes('/gatherings/detail');

    const minPercent = useMemo(() => {
        if (!capacity) return 0;
        return Math.min((5 / capacity) * 100, 100);
    }, [capacity]);

    // 현재 진행률 계산
    const progressPercent = useMemo(() => {
        if (!capacity) return 0;
        return Math.min((participantCount / capacity) * 100, 100);
    }, [participantCount, capacity]);

    return (
        <div className="w-full relative">
            {/* 배경 프로그레스바 */}
            <div className="w-full bg-gray-200 rounded-full h-2">
                <m.div
                    className="bg-main-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: true }}
                />
            </div>

            {/* 최소 인원 인디케이터 */}
            <m.div
                className="absolute -top-1 left-0"
                style={{ left: `calc(${minPercent}% - 8px)` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: "backOut" }}
            >
                <div className="size-4 bg-main-pink rounded-full border-2 border-white shadow" />
                {!isDetailPage && (
                    <m.span
                        className="hidden md:block absolute left-1/2 -translate-x-1/2 mt-1 text-xs text-main-pink font-semibold whitespace-nowrap"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 1,
                            duration: 0.3
                        }}
                    >
                        개설확정
                    </m.span>
                )}
            </m.div>
        </div>
    );
}