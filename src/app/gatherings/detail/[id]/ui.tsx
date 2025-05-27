'use client';

import { use, useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import { formatDate, formatTime, getTimeRemaining } from '@/components/shared/utils/format';
import { Heart, Check, UserRoundCheck } from "lucide-react"
import { PageProps } from '@/types/pageprops';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useGatheringDetail from '@/hooks/gathering/useGatheringDetail';
import useGatheringJoinChecking from '@/hooks/gathering/useGatheringJoinChecking';
import useJoinGathering from '@/hooks/gathering/useJoinGathering';
import useLeaveGathering from '@/hooks/gathering/useLeaveGathering';
import useCancelGathering from '@/hooks/gathering/useCancelGathering';
import Image from 'next/image';
import CheckLoginModal from '@/components/shared/ui/CheckingModal';
import SaveToggleButton from '@/components/gatherings/shared/ui/SaveToggleButton';

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

export default function GatheringsDetailPageUI({ params }: PageProps) {
    const { id } = use(params);
    const { token, userId, loginModalOpen, setLoginModalOpen } = useContext(AuthContext);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const { detail, participants, isLoading: detailLoading } = useGatheringDetail(Number(id));
    const { data: isParticipated, } = useGatheringJoinChecking(Number(id), token);
    const { joinGathering } = useJoinGathering(token);
    const { leaveGathering } = useLeaveGathering(token);
    const { cancelGathering } = useCancelGathering(token);

    const router = useRouter();

    const handleCancel = async () => setDeleteModalOpen(true);

    const handleDeleteConfirm = () => {
        cancelGathering(Number(id));
        router.replace('/gatherings');
        setDeleteModalOpen(false);
    };

    const percent = useMemo(() => {
        if (!detail?.participantCount || !detail?.capacity) return 0;
        return Math.min((detail.participantCount / detail.capacity) * 100, 100);
    }, [detail?.participantCount, detail?.capacity]);

    return (
        <>
            <main className='contents-container'>
                {/* 이미지, 모임 정보 카드 */}
                <section className='flex flex-col sm:flex-row gap-4'>
                    <article className='max-w-screen-lg sm:w-[30rem] h-[14rem]'>
                        <div className="relative px-3 bg-white/80 rounded-full flex items-center text-xs">
                            <div className="absolute top-3 left-3 bg-main-600 rounded-full px-3 py-1 flex justify-center items-center gap-2 z-10">
                                <Image src={"/icons/Alarm.svg"} alt="시간" width={24} height={24} />
                                <span className="font-medium text-white">{getTimeRemaining(detail?.registrationEnd || '')}</span>
                            </div>
                        </div>
                        {detailLoading ? (
                            <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
                        ) : (
                            <Image src={detail?.image || 'https://images.unsplash.com/photo-1615793927044-600a1ec42466?q=80&w=2129&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                                alt='모임 이미지'
                                width={1000}
                                height={1000}
                                className='w-full h-full object-cover rounded-lg'
                            />
                        )}
                    </article>
                    <article className='max-w-screen-lg sm:w-[30rem] h-[14rem] px-6 py-5 border-2 border-gray-300 bg-white rounded-lg flex flex-col justify-between gap-4'
                    >
                        {/* 상단 */}
                        <div className='flex justify-between gap-8'>
                            {/* LEFT */}
                            <div className='flex flex-col'>
                                {/* 제목, 주소 */}
                                <div className="flex flex-col min-w-0">
                                    <h2 className="text-xl font-bold max-w-full">{detail?.name.slice(0, 15) + '...' || '로딩 중...'}</h2>
                                    <span className="text-gray-500">{detail?.location || '장소'}</span>
                                </div>
                                {/* 날짜 시간 */}
                                <div className="flex items-center gap-1 text-sm text-gray-500">
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
                                                    src={participant?.User?.image || '/images/default_profile_image.svg'}
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
                                                                src={participant?.User?.image || '/images/default_profile_image.svg'}
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
                                {detail && detail?.participantCount > 0 ? (
                                    <div className='flex items-center gap-2'>
                                        <div className='p-1 bg-main-300 rounded-full'>
                                            <Check className='text-white w-3 h-3' />
                                        </div>
                                        <span>개설확정</span>
                                    </div>
                                ) : null}
                            </div>
                            {/* 프로그레스 바 */}
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className='bg-main-500 h-2 rounded-full transition-all duration-300' style={{ width: `${percent}%` }}></div>
                            </div>
                            {/* 최소인원, 최대인원 */}
                            <div className="flex justify-between text-sm">
                                <span>최소 5명</span>
                                <span>최대 {detail?.capacity}명</span>
                            </div>
                        </div>
                    </article>
                </section>
                {/* 모임 리뷰 목록 */}
                <section className='w-full h-full px-4 py-4 flex flex-col gap-4 bg-white rounded-lg'>
                    <h1 className='text-lg font-semibold'>다른 참여자들은 이렇게 느꼈어요!</h1>
                    {/* 아이템 */}
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className='w-full border-dotted border-b-2 border-main-300 flex flex-col gap-2'>
                            <div className='flex gap-1'>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Heart key={index} className="w-4 h-4 fill-main-500 text-main-500" />
                                ))}
                            </div>
                            <p className='text-sm'>재밌는 모임이었어요! 다음에도 만나기로 했습니다 ㅋㅋㅋ</p>
                            <div className='flex items-center gap-1 text-xs'>
                                <Image src='/images/default_profile_image.svg' alt='프로필 이미지' width={32} height={32} className='rounded-full' />
                                <span>닉네임</span>
                                <span>|</span>
                                <span>2025.05.22</span>
                            </div>
                            <div className='w-full h-1'></div>
                        </div>
                    ))}
                    {/* 페이지 컨버터 */}
                    <div className="flex justify-center items-center gap-2">
                        <button className="w-8 h-8 flex items-center justify-center text-gray-500 transition">〈</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-main-500 bg-main-500 text-white font-bold">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-main-100 transition">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-main-100 transition">3</button>
                        <span className="mx-1 text-gray-400">...</span>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-main-100 transition">10</button>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-500 transition">〉</button>
                    </div>
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
                                onClick={() => {
                                    if (!token) setDeleteModalOpen(true);
                                    else handleCancel()
                                }}
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
            </footer >
            <CheckLoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} text='로그인이 필요합니다.' />
            <CheckLoginModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                text="모임을 삭제 하시겠습니까?"
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
}
