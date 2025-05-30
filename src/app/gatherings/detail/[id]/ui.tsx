'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchGatheringDetail } from '@/hooks/api/useFetchGatheringDetail';
import { useFetchDetailReview } from '@/hooks/api/useFetchDetailReview';
import { useCheckJoined } from '@/hooks/api/useCheckJoined';
import { useJoinGathering } from '@/hooks/api/useJoinGathering';
import { useCancelGathering } from '@/hooks/api/useCancelGathering';
import { useLeaveGathering } from '@/hooks/api/useLeaveGathering';
import { AuthContext } from '@/providers/AuthProvider';
import { formatDate, formatTime, getTimeRemaining } from '@/components/shared/utils/format';
import { Heart, Check, UserRoundCheck } from "lucide-react"
import { ReviewItem, Reviews } from '@/types/reviews';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from 'next/image';
import ConfirmDialog from '@/components/shared/ui/ConfirmDialog';
import SaveToggleButton from '@/components/gatherings/shared/ui/SaveToggleButton';
import JoinedCountsProgressBar from '@/components/gatherings/shared/ui/JoinedCountsProgressBar';
import DetailInformationLoading from '@/components/gatherings/detail/DetailInformationLoading';
import DetailThumbnailLoading from '@/components/gatherings/detail/DetailThumbnailLoading';
import DetailReviewLoading from '@/components/gatherings/detail/DetailReviewLoading';

interface Participant {
    teamId: number;
    userId: number;
    gatheringId: number;
    joinedAt: string;
    User: {
        id: number;
        email: string;
        name: string;
        companyName: string;
        image: string;
    }
}

const handleCopyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
};

const LIMIT = 4;

export default function GatheringsDetailPageUI({ id, detailReviews }: { id: string, detailReviews: Reviews }) {
    const { token, userId, loginModalOpen, setLoginModalOpen } = useContext(AuthContext);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [page, setPage] = useState(detailReviews?.currentPage ?? 1);
    const [reviews, setReviews] = useState<ReviewItem[]>(detailReviews.data);

    const router = useRouter();

    const offset = (page - 1) * LIMIT;

    const { detail, participants, isLoading: detailLoading } = useFetchGatheringDetail(Number(id));
    const { data: isParticipated, } = useCheckJoined(Number(id), token);
    const { data: nextPageData, isLoading: reviewsLoading } = useFetchDetailReview(
        Number(id),
        LIMIT,
        offset,
        page > 1
    );

    const { joinGathering } = useJoinGathering({
        token,
        onErrorCallback: (message) => {
            setErrorMessage(message);
            setErrorModalOpen(true);
        }
    });
    const { leaveGathering } = useLeaveGathering(
        {
            token,
            onErrorCallback: (message) => {
                setErrorMessage(message);
                setErrorModalOpen(true);
            }
        });
    const { cancelGathering } = useCancelGathering({
        token,
        onErrorCallback: (message) => {
            setErrorMessage(message);
            setErrorModalOpen(true);
        }
    });

    // 1페이지는 SSR 데이터만, 2페이지부터 useFetchDetailReview로 데이터 추가
    useEffect(() => {
        if (page === 1) return;
        if (nextPageData) setReviews(detailReviews.data.concat(nextPageData.data));
    }, [page, nextPageData, detailReviews.data]);

    const handleDeleteConfirm = () => {
        cancelGathering(Number(id));
        router.replace('/gatherings');
        setDeleteModalOpen(false);
    };

    return (
        <>
            <main className='contents-container'>
                {detailLoading ? (
                    <>
                        <section className='flex flex-col sm:flex-row gap-4'>
                            <DetailThumbnailLoading />
                            <DetailInformationLoading />
                        </section>
                    </>
                ) : (
                    // 모임 썸네일과 정보
                    <section className='flex flex-col sm:flex-row gap-4'>
                        {/* 썸네일 */}
                        <article className='max-w-screen-lg sm:w-[30rem] h-[14rem]'>
                            <div className="relative px-3 bg-white/80 rounded-full flex items-center text-xs">
                                <div className="absolute top-3 left-3 bg-main-600 rounded-full px-3 py-1 flex justify-center items-center gap-2 z-10">
                                    <Image src={"/icons/Alarm.svg"} alt="시간" width={24} height={24} />
                                    <span className="font-medium text-white">{getTimeRemaining(detail?.registrationEnd || '')}</span>
                                </div>
                            </div>
                            <Image src={detail?.image}
                                alt='모임 이미지'
                                width={1000}
                                height={1000}
                                className='w-full h-full object-cover rounded-lg'
                            />
                        </article>
                        {/* 모임 정보 */}
                        <article className='max-w-screen-lg sm:w-[30rem] h-[14rem] px-6 py-5 border-2 border-gray-300 bg-white rounded-lg flex flex-col justify-between gap-4 overflow-hidden'
                        >
                            {/* 상단 */}
                            <div className='flex justify-between gap-8'>
                                {/* LEFT */}
                                <div className='flex flex-col'>
                                    {/* 제목, 주소 */}
                                    <div className="flex flex-col min-w-0">
                                        <h2 className="text-xl font-bold max-w-full" title={detail?.name}>
                                            {detail?.name
                                                ? detail.name.length > 20
                                                    ? detail.name.slice(0, 20) + '...'
                                                    : detail.name
                                                : ''}
                                        </h2>
                                        <span className="text-gray-500">{detail?.location || '장소'}</span>
                                    </div>
                                    {/* 날짜 시간 */}
                                    <div className="flex sm:hidden md:flex items-center gap-1 text-sm text-gray-500">
                                        <span>{formatDate(detail?.dateTime || 'OOOO-OO-OO')}</span>
                                        <span>·</span>
                                        <span>{formatTime(detail?.dateTime || 'OO:OO')}</span>
                                    </div>
                                </div>
                                {/* RIGHT 찜하기 버튼 */}
                                <SaveToggleButton gatheringId={id} />
                            </div>
                            <div className="w-full border-t-2 border-dotted border-gray-300"></div>
                            {/* 하단 */}
                            <div className='flex flex-col gap-1'>
                                {/* 모집정원, 개설확정 */}
                                <div className="flex justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className='flex items-center gap-1'>
                                            <UserRoundCheck className='w-4 h-4 text-main-500' />
                                            <span>{detail?.participantCount}명 참여 중</span>
                                        </div>
                                        {/* 참여자들의 프로필 이미지 */}
                                        <TooltipProvider>
                                            <div className="flex items-center">
                                                {participants?.slice(0, 4).map((participant: Participant, i: number) => (
                                                    <Image
                                                        key={participant?.User?.id}
                                                        src={participant?.User?.image || '/icons/default_profile_image.svg'}
                                                        alt="프로필 이미지"
                                                        width={100}
                                                        height={100}
                                                        className={`w-8 h-8 rounded-full border-2 border-white ${i === 0 ? 'ml-0' : '-ml-2'}`}
                                                    />
                                                ))}
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center cursor-pointer">
                                                            <span className='text-sm font-semibold'>
                                                                {participants?.length - 4 > 0 ? `+${participants?.length - 4}` : '+0'}
                                                            </span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" align="center" className="flex gap-1 bg-white border border-button rounded-lg p-2 shadow-lg">
                                                        {participants?.slice(4).length > 0 ? (
                                                            participants?.slice(4).map((participant: Participant, i: number) => (
                                                                <Image
                                                                    key={participant?.User?.id}
                                                                    src={participant?.User?.image || '/icons/default_profile_image.svg'}
                                                                    alt="프로필 이미지"
                                                                    width={100}
                                                                    height={100}
                                                                    className={`w-8 h-8 rounded-full border-2 border-white ${i === 0 ? 'ml-0' : '-ml-2'}`}
                                                                />
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-gray-400">아직 없습니다</span>
                                                        )}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </TooltipProvider>
                                    </div>
                                    {detail && detail?.participantCount >= 5 ? (
                                        <div className='flex items-center gap-2'>
                                            <div className='p-1 bg-main-300 rounded-full'>
                                                <Check className='text-white w-3 h-3' />
                                            </div>
                                            <span>개설확정</span>
                                        </div>
                                    ) : null}
                                </div>
                                {/* 프로그레스 바 */}
                                <JoinedCountsProgressBar participantCount={detail?.participantCount} capacity={detail?.capacity} />
                                {/* 최소인원, 최대인원 */}
                                <div className="flex justify-between text-sm">
                                    <span>최소 5명</span>
                                    <span>최대 {detail?.capacity}명</span>
                                </div>
                            </div>
                        </article>
                    </section>
                )}
                {/* 모임 리뷰 목록 */}
                <section className='w-full h-full px-4 py-4 flex flex-col gap-4 bg-white rounded-lg'>
                    <h1 className='text-lg font-semibold'>다른 참여자들은 이렇게 느꼈어요!</h1>
                    {reviewsLoading ? (
                        <DetailReviewLoading width='w-full' height='h-32' />
                    ) : (
                        reviews?.map((review: ReviewItem) => (
                            <div
                                key={review?.id}
                                className='w-full border-dotted border-b-2 border-main-300 flex flex-col gap-2'>
                                <div className='flex gap-1'>
                                    {Array.from({ length: review?.score }).map((_, index) => (
                                        <Heart key={index} className="w-4 h-4 fill-main-500 text-main-500" />
                                    ))}
                                    {Array.from({ length: 5 - review?.score }).map((_, index) => (
                                        <Heart key={index} className="w-4 h-4 fill-gray-300 text-gray-300" />
                                    ))}
                                </div>
                                <p className='text-sm'>{review?.comment}</p>
                                <div className='flex items-center gap-1 text-xs'>
                                    <Image src={review?.User?.image || '/icons/default_profile_image.svg'} alt='프로필 이미지' width={32} height={32} className='w-6 h-6 rounded-full' />
                                    <span>{review?.User?.name}</span>
                                    <span>|</span>
                                    <span>{formatDate(review?.createdAt || 'OOOO-OO-OO')}</span>
                                </div>
                                <div className='w-full h-1'></div>
                            </div>
                        ))
                    )}
                    {/* 페이지 컨버터 */}
                    {detailReviews?.totalPages >= 1 ? (
                        <div className="flex justify-center items-center gap-2 mt-4">
                            <button
                                className="w-8 h-8 flex items-center justify-center text-gray-500 transition"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >〈</button>
                            {Array.from({ length: detailReviews?.totalPages }).map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full border ${page === idx + 1 ? 'border-main-500 bg-main-500 text-white font-bold' : 'border-gray-300 bg-white text-gray-500 hover:bg-main-100 transition'}`}
                                    onClick={() => setPage(idx + 1)}
                                >{idx + 1}</button>
                            ))}
                            <button
                                className="w-8 h-8 flex items-center justify-center text-gray-500 transition"
                                disabled={page === detailReviews?.totalPages}
                                onClick={() => setPage(page + 1)}
                            >〉</button>
                        </div>
                    ) : (<p className='p-20 mx-auto text-sm text-gray-500'>아직 리뷰가 없습니다.</p>)}
                </section>
            </main >
            {/* 모임 참가 Footer */}
            <footer className='sticky bottom-0 w-full h-16 border-t border-gray-300 bg-white' >
                <div className='max-w-screen-lg h-full mx-auto px-4 md:px-20 flex justify-between items-center'>
                    <div className='flex flex-col gap-1'>
                        <span className='font-semibold'>Meet Meet Together</span>
                        <span className='text-xs font-medium'>모임은 여러분을 기다리고 있어요!</span>
                    </div>
                    {userId === detail?.createdBy ?
                        <div className='flex gap-2'>
                            <button type="button"
                                onClick={() => { setDeleteModalOpen(true) }}
                                className='w-24 h-[60%] py-1 bg-button-text text-button border-button border-1 rounded-lg cursor-pointer hover:opacity-60 transition duration-300 ease-in'>삭제하기</button>
                            <button type="button"
                                onClick={handleCopyUrl}
                                className='w-24 h-[60%] py-1 bg-button text-button-text rounded-lg cursor-pointer hover:opacity-60 transition duration-300 ease-in'>공유하기</button>
                        </div>
                        :
                        isParticipated ? (
                            <button type="button"
                                onClick={() => leaveGathering(Number(id))}
                                className='max-w-36 h-[60%] py-1 px-2 bg-button-text text-button border-1 border-button rounded-lg cursor-pointer hover:opacity-60 transition duration-300 ease-in'>참여 취소하기</button>
                        ) : (
                            <button type="button"
                                onClick={() => {
                                    if (!token) setLoginModalOpen(true);
                                    else joinGathering(Number(id))
                                }}
                                className='w-24 h-[60%] py-1 bg-button text-button-text rounded-lg cursor-pointer hover:opacity-60 transition duration-300 ease-in'>참여하기</button>
                        )
                    }
                </div>
            </footer>
            <ConfirmDialog open={loginModalOpen} onClose={() => setLoginModalOpen(false)} text='로그인이 필요합니다.' needLogin={true} />
            <ConfirmDialog
                open={deleteModalOpen}
                text="모임을 삭제 하시겠습니까?"
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
            <ConfirmDialog
                open={errorModalOpen}
                text={errorMessage}
                onClose={() => setErrorModalOpen(false)}
            />
        </>
    );
}
