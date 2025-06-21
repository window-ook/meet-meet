import { Metadata } from 'next';
import { getFilteredReviews } from '@/actions/reviews/getFilteredReviews';
import ReviewsUI from "@/components/reviews/ReviewsUI";

export const metadata: Metadata = {
    title: `모든 리뷰 | Meet Meet`,
    description: `모임 리뷰 페이지입니다`,
};

/**
 * 리뷰 페이지 컴포넌트
 */
export default async function ReviewsPage({
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
    const ssrReviews = await getFilteredReviews(params);

    return (
        <main className="contents-container">
            <ReviewsUI
                ssrReviews={ssrReviews}
                initialFilters={{
                    mainType: params.mainType || 'DALLAEMFIT',
                    location: params.location || '',
                    date: params.date || '',
                    sortBy: params.sortBy || 'createdAt',
                    sortOrder: params.sortOrder || 'desc'
                }}
            />
        </main>
    );
}