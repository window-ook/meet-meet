import { useMemo } from 'react';

export default function JoinedCountsProgressBar({ participantCount, capacity }: { participantCount: number, capacity: number }) {
    const percent = useMemo(() => {
        if (!participantCount || !capacity) return 0;
        return Math.min((participantCount / capacity) * 100, 100);
    }, [participantCount, capacity]);

    return (
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div className='bg-main-500 h-2 rounded-full transition-all duration-300' style={{ width: `${percent}%` }}></div>
        </div>
    );
}

