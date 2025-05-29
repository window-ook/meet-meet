'use client';

import { useState, useContext } from 'react';
import { useWriteReview } from '@/hooks/api/useWriteReview';
import { AuthContext } from '@/providers/AuthProvider';

interface ReviewDialogProps {
  reviewData: {
    teamId: string;
    gatheringId: number;
    userId: number;
  };
  onClose: () => void;
}

export default function ReviewDialog({
  reviewData,
  onClose,
}: ReviewDialogProps) {
  const [score, setScore] = useState(1);
  const [comment, setComment] = useState('');
  const { token } = useContext(AuthContext);
  const { mutateWriteReview } = useWriteReview(onClose);

  const handleSubmit = () => {
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    mutateWriteReview({
      gatheringId: reviewData.gatheringId,
      score,
      comment,
      token,
    });
  };

  return (
    <div className="bg-opacity-40 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-md bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">리뷰 작성</h2>
        <label className="mb-2 block">별점 (1~5):</label>
        <input
          type="number"
          value={score}
          onChange={e => setScore(Number(e.target.value))}
          className="mb-4 w-full border p-2"
          min={1}
          max={5}
        />

        <label className="mb-2 block">코멘트:</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="mb-4 w-full border p-2"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded bg-gray-300 px-4 py-2">
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
}
