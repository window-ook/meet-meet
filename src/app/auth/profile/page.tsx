import { Metadata } from 'next';
import ProfileForm from '@/components/auth/ProfileForm';

export const metadata: Metadata = {
    title: `프로필 등록 | Meet Meet`,
    description: `프로필 등록 페이지 입니다.`,
};

export default function ProfilePage() {
    return <ProfileForm />
}

