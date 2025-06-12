'use client';

import dynamic from "next/dynamic";

const ProfileEditDialog = dynamic(() => import('@/components/shared/ui/ProfileEditDialog'), { ssr: false });

export default function ProfileForm() {
    return <ProfileEditDialog setIsProfileEditDialogOpen={() => { }} />
}