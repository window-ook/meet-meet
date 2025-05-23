"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function GatheringsList() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [gatherings, setGatherings] = useState([]);

    // 로그인한 사용자가 참석한 모임 목록 조회
    const fetchJoinedGatherings = async () => {
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token');

            const response = await axios.get('/api/gatherings/joined', {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });

            setGatherings(response.data);
        } catch (err) {
            setError('참석한 모임 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJoinedGatherings();
    }, []);

    return (
        <div className="w-full flex flex-col justify-start gap-5">
            {loading && (
                <div className="w-full h-[100px] flex justify-center items-center border-2 border-blue-500">
                    <h1>로딩 중...</h1>
                </div>
            )}

            {error && (
                <div className="w-full h-[100px] flex justify-center items-center border-2 border-red-500">
                    <h1 className="text-red-500">{error}</h1>
                </div>
            )}

            {!loading && !error && gatherings.map((gathering: any, index: number) => (
                <div key={gathering.id || index} className="w-full min-h-[100px] flex flex-col justify-start p-4 border-2 border-blue-500 rounded-lg">
                    <h1 className="text-lg font-semibold">{gathering.name || `모임 ${index + 1}`}</h1>
                    <img src={gathering.image} alt="모임 이미지" className="w-[100px] h-[100px] rounded-lg" />
                    <p className="text-gray-600">위치: {gathering.location}</p>
                    <p className="text-gray-600">종류: {gathering.type}</p>
                    <p className="text-gray-600">참여자: {gathering.participantCount}/{gathering.capacity}명</p>
                    {gathering.dateTime && (
                        <p className="text-gray-600">
                            날짜: {new Date(gathering.dateTime).toLocaleDateString()}{" "}
                            {gathering.isCompleted && <span className="text-green-600">(종료됨)</span>}
                        </p>
                    )}
                    {gathering.isReviewed && (
                        <p className="text-sm text-violet-600">✅ 리뷰 작성 완료</p>
                    )}
                </div>
            ))}

            {!loading && !error && gatherings.length === 0 && (
                <div className="w-full h-[100px] flex justify-center items-center border-2 border-gray-500">
                    <h1>참석한 모임이 없습니다.</h1>
                </div>
            )}
        </div>
    );
}
