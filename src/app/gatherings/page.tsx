import { Metadata } from 'next';
import { getActiveGatheringsWithSkip } from '@/actions/gathering/getActiveGatheringsWithSkip';
import GatheringsUI from "@/components/gatherings/GatheringsUI";

export const metadata: Metadata = {
    title: `모임 찾기 | Meet Meet`,
    description: `모임 찾기 페이지 입니다`,
};

/**
 * 모임 찾기 페이지
 */
export default async function GatheringsPage({
    searchParams
}: {
    searchParams: Promise<{
        mainType?: string;
        location?: string;
        date?: string;
        sortBy?: string;
        sortOrder?: string;
    }>
}) {
    const params = await searchParams;

    const { gatherings: ssrGatherings, activeStartIndex } = await getActiveGatheringsWithSkip(params);

    return (
        <main className="contents-container">
            <GatheringsUI
                ssrGatherings={ssrGatherings}
                activeStartIndex={activeStartIndex}
                initialFilters={{
                    mainType: params.mainType || 'DALLAEMFIT',
                    location: params.location || '',
                    date: params.date || '',
                    sortBy: params.sortBy || 'registrationEnd',
                    sortOrder: params.sortOrder || 'asc'
                }}
            />
        </main>
    );
}