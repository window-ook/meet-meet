import GatheringsDetailPageUI from './ui';

/**
 * 페이지 프로퍼티: 서버 컴포넌트 -> 클라이언트 컴포넌트 파라미터 전달
 * @type {Promise<{ id: string }>} params의 비동기 반환 id 값
 */
export interface PageProps {
    params: Promise<{ id: string }>;
}

export default function GatheringsDetailPage({ params }: PageProps) {
    return <GatheringsDetailPageUI params={params} />
}