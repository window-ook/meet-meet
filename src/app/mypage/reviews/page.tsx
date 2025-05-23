import { Metadata } from 'next';
import ReviewsUI from './ui';

export const metadata: Metadata = {
  title: `나의 리뷰 | Meet Meet`,
  description: `참여 모임 리뷰 관리 페이지 입니다`,
};

export default function Review() {
  return <ReviewsUI />;
}