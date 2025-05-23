import { Metadata } from 'next';
import CreatedMeetingUI from './ui';

export const metadata: Metadata = {
  title: `내가 만든 모임 | Meet Meet`,
  description: `내가 만든 모임 페이지 입니다`,
};

export default function CreatedMeeting() {
  return <CreatedMeetingUI />;
}