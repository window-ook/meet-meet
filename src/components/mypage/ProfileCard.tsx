
export default function ProfileCard() {
  return (
    <div className="rounded-lg overflow-hidden border mb-4">
      {/* Card Header with Orange Background */}
      <div className="bg-main-350 p-4 relative">
        <div className="text-gray-800 text-lg font-bold mb-1">내 프로필</div>
        <div className="absolute right-4 top-4">
          <button>
            <img src="/icons/edit.svg" alt="프로필 수정" width={36} height={36} />
          </button>
        </div>
        {/*Background */}
        <div className="h-6 mt-2 relative">
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center">
            <img src="/icons/bg.svg" alt="배경" width={160} height={120} />
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-white p-4 flex items-center h-full">
        <div className="border-gray-100 rounded-full p-0.5 mr-4">
          <button>
            <img src="/icons/profile-edit-icon.svg" alt="프로필 수정" width={63} height={63} />
          </button>
        </div>
        <div>
          <div className="text-gray-800 font-bold text-md">홍길동</div>
          <div className="text-sm text-gray-800 flex gap-2">
            <div className="font-bold">company.</div>
            <div>코드잇</div>
          </div>
          <div className="text-sm text-gray-800 flex gap-2">
            <div className="font-bold">E-mail.</div>
            <div> codeit@codeit.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}
