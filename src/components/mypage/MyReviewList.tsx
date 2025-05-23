import { useState } from "react";

interface MyReviewListProps {
  gatherings: any[];
}

export default function MyReviewList({ gatherings }: MyReviewListProps) {
  const [reviews, setReviews] = useState(0); // 0: 작성 가능한 리뷰, 1: 작성한 리뷰

  const reviewedGatherings = gatherings.filter((g) => g.isReviewed);
  const writableGatherings = gatherings.filter((g) => !g.isReviewed);

  const isEmpty =
    (reviews === 0 && writableGatherings.length === 0) ||
    (reviews === 1 && reviewedGatherings.length === 0);

  const list = reviews === 0 ? writableGatherings : reviewedGatherings;

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* 탭 버튼 */}
      <div className="mx-5 flex items-center gap-2">
        <button
          onClick={() => setReviews(0)}
          className={`rounded-lg px-4 py-2 text-sm transition-colors
            ${reviews === 0 ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"}`}
        >
          작성 가능한 리뷰
        </button>
        <button
          onClick={() => setReviews(1)}
          className={`rounded-lg px-4 py-2 text-sm transition-colors
            ${reviews === 1 ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"}`}
        >
          작성한 리뷰
        </button>
      </div>

      {/* 리뷰 없음 안내 */}
      {isEmpty ? (
        <div className="w-full h-[100px] flex justify-center items-center text-gray-700">
          <h1>
            {reviews === 0
              ? "작성 가능한 리뷰가 없어요"
              : "아직 작성한 리뷰가 없어요"}
          </h1>
        </div>
      ) : (
        // 리뷰 목록
        <div className="flex flex-col gap-4">
          {list.map((g) => (
            <div key={g.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <p className="font-semibold text-gray-800">
                {reviews === 0 ? "✏️" : "📝"} {g.name}
              </p>
              <p className="text-sm text-gray-500">
                {g.location} - {new Date(g.dateTime).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
