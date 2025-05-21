"use client"


import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";


// 모임 목록 인터페이스
interface Gathering {
    id: string;
    name: string;
    image: string;
    location: string;
    type: string;
    participantCount: number;
    capacity: number;
    dateTime: string;
}


export default function GatheringsList() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [gatherings, setGatherings] = useState<Gathering[]>([]);
    
    // react query로 변경
    const fetchGatherings = async () => {
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token');
            
            const response = await axios.get('/api/gatherings', {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            
            setGatherings(response.data);
        } catch {
            setError('모임 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGatherings();
    }, []);


    return (
        <div className="w-full flex flex-col justify-start gap-5">
            {/* 로딩 상태 */}
            {loading && (
                <div className="w-full h-[100px] flex justify-center items-center border-2 border-blue-500">
                    <h1>로딩 중...</h1>
                </div>
            )}
            
            {/* 에러 상태 */}
            {error && (
                <div className="w-full h-[100px] flex justify-center items-center border-2 border-red-500">
                    <h1 className="text-red-500">{error}</h1>
                </div>
            )}
            
            {/* 모임 목록 */}
            {!loading && !error && gatherings.map((gathering: Gathering, index: number) => (
                <div key={gathering.id || index} className="w-full min-h-[100px] flex flex-col justify-start p-4 border-2 border-blue-500 rounded-lg">
                    <h1 className="text-lg font-semibold">{gathering.name || `모임 ${index + 1}`}</h1>
                    <Image src={gathering.image} alt="모임 이미지" className="rounded-lg" width={100} height={100}/>
                    <p className="text-gray-600">위치: {gathering.location}</p>
                    <p className="text-gray-600">종류: {gathering.type}</p>
                    <p className="text-gray-600">참여자: {gathering.participantCount}/{gathering.capacity}명</p>
                    {gathering.dateTime && <p className="text-gray-600">날짜: {new Date(gathering.dateTime).toLocaleDateString()}</p>}
                </div>
            ))}
            
            {/* 빈 목록 */}
            {!loading && !error && gatherings.length === 0 && (
                <div className="w-full h-[100px] flex justify-center items-center border-2 border-gray-500">
                    <h1>모임이 없습니다.</h1>
                </div>
            )}
        </div>
    );
}