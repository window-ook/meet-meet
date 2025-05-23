"use client";

import { useState } from "react";
import ProfileCard from "../../../components/mypage/ProfileCard"
import Image from "next/image";



export default function CreatedMeetingUI() {
    const [selectedTab, setSelectedTab] = useState(0);
    
    return (
        <>
        <div className="bg-gray-50 min-h-screen">
            {/* My Page Section */}
            <div className="bg-gray-50 min-h-screen">
                <div className="bg-gray-30 min-h-screen">
                    <div className="mx-5 pt-[4rem] px-6">
                        <h1 className="my-10 text-2xl font-bold text-gray-700 mb-4">마이 페이지</h1>
                        <div className="border-2 rounded-lg overflow-hidden mb-4">
                            <ProfileCard />
                        </div>
                        {/*Tab Navigation*/}
                        <div className="bg-white border-t-3 border-gray-800  ">
                            <div className="my-5 flex gap-4 text-xl text-bold p-8">                             
                                <button    
                                onClick={() => setSelectedTab(0)}
                                className={`${selectedTab === 0 ? "border-gray-700  border-b-3 pb-2 text-gray-700 font-semibold" : "text-gray-400 font-semibold"}`}>
                                    나의 모임
                                </button>
                                <button 
                                onClick={() => setSelectedTab(1)}
                                className={`${selectedTab === 1 ? "border-gray-700  border-b-3 pb-2 text-gray-700 font-semibold" : "text-gray-400 font-semibold"}`}>
                                    나의 리뷰
                                </button>
                                <button 
                                onClick={() => setSelectedTab(2)}
                                className={`${selectedTab === 2 ? "border-gray-700  border-b-3 pb-2 text-gray-700 font-semibold" : "text-gray-400 font-semibold"}`}>
                                    내가 만든 모임
                                </button>
                            </div>
                            {/*모임 목록*/}
                            {/*모임 1*/}
                            <div className="px-8 flex gap-4 border-b-2 border-dotted p-4">
                                    <Image 
                                        className="rounded-lg object-cover"                                        
                                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1lZXRpbmd8ZW58MHx8MHx8fDA%3D"
                                        width={200}
                                        height= {120}
                                        alt="모임 이미지"
                                        priority
                                    />
                                <div>
                                    <div className="flex gap-2 py-2">
                                        <div>
                                            {/*scheduled.svg*/}
                                            <Image src="/icons/scheduled.svg" alt="이용예정" width={72} height={120} />
                                        </div>
                                        <div>
                                            {/*sonfirmed.svg*/}
                                            <Image src="/icons/confirmed.svg" alt="개설확정" width={90} height={120} />
                                        </div>
                                    </div>
                                        <div className="flex">
                                            <h3 className="py-2 font-semibold">달램핏 오피스 스트레칭 &nbsp;</h3>
                                            <span className="py-2"> | </span>
                                            <span className="py-2"> &nbsp; 을지로 3가</span>
                                        </div>
                                        <span className="flex items-center space-x-2">
                                            <span>1월 7일 . 17:30</span>
                                            <Image src="/icons/user.svg" alt="유저" width={20} height={20} className="inline-block" />
                                            <span>20/20</span>
                                        </span>
                                        <div className="py-2">
                                            <button className="inline-block border border-main-500 text-main-500 rounded-md px-4 py-2 text-sm ">예약 취소하기</button>
                                        </div>                                      
                                </div>
                            </div>
                            {/*모임 2*/}
                            <div className="px-8 flex gap-4 border-b-2 border-dotted p-4">
                                    <Image 
                                        className="rounded-lg object-cover"                                        
                                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1lZXRpbmd8ZW58MHx8MHx8fDA%3D"
                                        width={200}
                                        height={150}
                                        alt="모임 이미지"
                                    />
                                <div>
                                    <div className="flex gap-2 py-2">
                                        <div>
                                            {/*scheduled.svg*/}
                                            <Image src="/icons/scheduled.svg" alt="이용예정" width={72} height={120} />
                                        </div>
                                        <div>
                                            {/*sonfirmed.svg*/}
                                            <Image src="/icons/confirmed.svg" alt="개설확정" width={90} height={120} />
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <h3 className="py-2 font-semibold">달램핏 오피스 스트레칭 &nbsp;</h3>
                                        <span className="py-2"> | </span>
                                        <span className="py-2"> &nbsp; 을지로 3가</span>
                                    </div>
                                    <span className="flex items-center space-x-2">
                                        <span>1월 7일 . 17:30</span>
                                        <Image src="/icons/user.svg" alt="유저" width={20} height={20} className="inline-block" />
                                        <span>20/20</span>
                                    </span>
                                    <div className="py-2">
                                        <button className="inline-block border border-main-500 text-main-500 rounded-md px-4 py-2 text-sm ">예약 취소하기</button>
                                    </div>                                       
                                </div>
                            </div>
                            {/*모임 3*/}
                            <div className="px-8 flex gap-4 border-b-2 border-dotted p-4">
                                    <Image 
                                        className="rounded-lg object-cover"                                        
                                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1lZXRpbmd8ZW58MHx8MHx8fDA%3D"
                                        width={200}
                                        height={150}
                                        alt="모임 이미지"
                                    />
                                <div>
                                    <div className="flex gap-2 py-2">
                                        <div>
                                            {/*scheduled.svg*/}
                                            <Image src="/icons/scheduled.svg" alt="이용예정" width={72} height={120} />
                                        </div>
                                        <div>
                                            {/*sonfirmed.svg*/}
                                            <Image src="/icons/confirmed.svg" alt="개설확정" width={90} height={120} />
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <h3 className="py-2 font-semibold">달램핏 오피스 스트레칭 &nbsp;</h3>
                                        <span className="py-2"> | </span>
                                        <span className="py-2"> &nbsp; 을지로 3가</span>
                                    </div>
                                    <span className="flex items-center space-x-2">
                                        <span>1월 7일 . 17:30</span>
                                        <Image src="/icons/user.svg" alt="유저" width={20} height={20} className="inline-block" />
                                        <span>20/20</span>
                                    </span>
                                    <div className="py-2">
                                        <button className="inline-block border border-main-500 text-main-500 rounded-md px-4 py-2 text-sm ">예약 취소하기</button>
                                    </div>                                        
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
