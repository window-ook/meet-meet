'use client';

import { useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import Image from 'next/image';
import axios from 'axios';
import { useLeaveGathering } from '@/hooks/api/useLeaveGatherings';
import ConfirmDialog from '@/components/shared/ui/ConfirmDialog';

export interface GatheringData {
  id: string;
  name: string;
  image?: string;
  location?: string;
  type?: string;
  participantCount?: number;
  capacity?: number;
  dateTime?: string;
  isCompleted?: boolean;
  isReviewed?: boolean;
}

const fetchJoinedGatherings = async (token: string): Promise<GatheringData[]> => {
  const { data } = await axios.get(`/api/gatherings/joined?&limit=1000`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export default function JoinedGatherings() {
  const { token } = useContext(AuthContext);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    data: gatherings = [],
    isLoading,
    error,
  } = useQuery<GatheringData[], Error>({
    queryKey: ['joinedGatherings', token],
    queryFn: () => fetchJoinedGatherings(token!),
    enabled: !!token,
  });

  const { leaveGathering } = useLeaveGathering({
    token,
    onErrorCallback: (message) => {
      setErrorMessage(message);
      setErrorModalOpen(true);
    },
  });

  if (!token) {
    return (
      <div className="text-main-500 flex h-[100px] w-full items-center justify-center">
        토큰 없음
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[100px] w-full items-center justify-center">
        로딩 중...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">에러 발생: {error.message}</div>;
  }

  if (gatherings.length === 0) {
    return <div className="text-gray-500">참석한 모임이 없습니다.</div>;
  }

  const sortedGatherings = [...gatherings].sort((a, b) => {
    const aTime = new Date(a.dateTime || '').getTime();
    const bTime = new Date(b.dateTime || '').getTime();

    if (a.isCompleted === b.isCompleted) {
      return aTime - bTime;
    }
    return a.isCompleted ? 1 : -1; 
  });

  return (
    <main className="contents-container">
      {sortedGatherings.map(data => (
        <div
          key={data.id}
          className="relative flex min-h-[100px] w-full flex-col rounded-lg border-2 border-gray-200 p-4 transition hover:shadow-md"
        >

          {data.isCompleted && (
            <div className="absolute top-2 right-2 px-3 py-1 text-xs bg-gray-200 text-gray-500 rounded-full shadow">
              이용 완료
            </div>
          )}

          <h1 className="text-lg font-semibold text-gray-800">{data.name}</h1>

          {data.image && (
            <Image
              src={data.image}
              alt={`${data.name} 이미지`}
              width={100}
              height={100}
              className="pointer-events-none my-2 rounded-lg object-cover"
            />
          )}

          {data.location && <p className="text-gray-600">위치: {data.location}</p>}
          {data.type && <p className="text-gray-600">종류: {data.type}</p>}
          {data.participantCount != null && data.capacity != null && (
            <p className="text-gray-600">
              참여자: {data.participantCount}/{data.capacity}명
            </p>
          )}
          {data.dateTime && (
            <p className="text-gray-600">
              날짜: {new Date(data.dateTime).toLocaleDateString()}
              {data.isCompleted && <span className="text-green-600"> (종료됨)</span>}
            </p>
          )}
          {data.isReviewed && (
            <p className="text-sm text-violet-600">✅ 리뷰 작성 완료</p>
          )}

          {/* 종료되지 않은 모임만 버튼 표시 */}
          {!data.isCompleted && (
            <button
              className="max-w-36 h-[60%] py-1 px-2 mt-2 bg-button-text text-button border-1 border-button rounded-lg cursor-pointer hover:opacity-60 transition duration-300 ease-in"
              onClick={() => leaveGathering(Number(data.id))}
            >
              참여 취소하기
            </button>
          )}
        </div>
      ))}

      {/* 에러 모달 */}
      <ConfirmDialog
        open={errorModalOpen}
        text={errorMessage}
        onClose={() => setErrorModalOpen(false)}
      />
    </main>
  );
}
