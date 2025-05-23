import { Metadata } from 'next';
import MyPageUI from './ui';

export const metadata: Metadata = {
  title: `나의 모임 | Meet Meet`,
  description: `내가 참여한 모임 페이지 입니다`,
};

export default function MyPage() {
  return <MyPageUI />;
}