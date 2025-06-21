import type { Metadata } from 'next'
import { serverFetcher } from '@/lib/api/serverFetcher';
import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import { getDetailReview } from '@/actions/gathering/detail/getDetailReview';
import { Gathering } from '@/types/gatherings';
import GatheringsDetailUI from '@/components/gatherings/detail/GatheringDetailUI';

export interface PageProps {
    params: { id: string };
}

type Props = {
    params: Promise<{ id: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/**
 * 모임 상세 페이지의 메타데이터 생성
 * @param params - 모임 ID
 * @returns 모임 상세 페이지 타이틀, 디스크립션
 */
export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const { id } = await params;

    let detail;

    try {
        detail = await serverFetcher<Gathering>(`${EXTERNAL_PATHS.fetchGatheringDetail(Number(id))}`, { next: { revalidate: 60 } });
    } catch (error) {
        console.error('모임 상세 페이지 메타데이터 생성 실패:', error);
        detail = null;
    }

    return {
        title: `${detail?.name} 상세 정보 | Meet Meet`,
        description: `${detail?.name}의 상세 정보 페이지입니다.`,
    };
}

export default async function GatheringsDetailPage({ params }: PageProps) {
    const { id } = await params;
    const detailReviews = await getDetailReview(id);

    return (
        <GatheringsDetailUI id={id} detailReviews={detailReviews} />
    )
}