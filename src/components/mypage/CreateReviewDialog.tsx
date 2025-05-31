'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { useCreateReview } from '@/hooks/api/useCreateReview';

interface ReviewDialogProps {
  reviewData: {
    teamId: string;
    gatheringId: number;
    userId: number;
  };
  onClose: () => void;
}

export default function CreateReviewDialog({
  reviewData,
  onClose,
}: ReviewDialogProps) {
  const { token } = useContext(AuthContext);

  const [score, setScore] = useState(1);
  const [comment, setComment] = useState('');

  const { createReview } = useCreateReview(onClose);

  const handleSubmit = () => {
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    createReview({
      gatheringId: reviewData.gatheringId,
      score,
      comment,
      token,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md p-6 rounded-md bg-white shadow-md flex flex-col gap-4">
        <h2 className="text-xl font-semibold">리뷰 남기기</h2>
        <label className="block">만족스러운 경험이었나요?</label>
        <input
          type="number"
          value={score}
          onChange={e => setScore(Number(e.target.value))}
          className="w-full border p-2"
          min={1}
          max={5}
        />

        <label className="block">경험에 대해 알려주세요!</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="w-full border p-2"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg bg-gray-300 cursor-pointer">
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full px-4 py-2 rounded-lg bg-blue-500 text-white cursor-pointer"
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
}
