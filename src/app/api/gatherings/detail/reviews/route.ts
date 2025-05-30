import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

/**
 * 리뷰 목록 조회
 * @param request 
 * @method GET
 * @returns 모임 리뷰 목록
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const gatheringId = searchParams.get('gatheringId');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    try {
        if (!gatheringId) {
            return NextResponse.json(
                { error: '모임 id가 필요합니다.' },
                { status: 400 }
            );
        }

        const response = await axios.get(`${process.env.API_URI_DEV}/reviews`, { params: { gatheringId, limit, offset } });
        return new NextResponse(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        console.error('API 요청 중 오류 발생:', error);

        if (axios.isAxiosError(error)) {
            if (error.response) {
                return NextResponse.json(
                    error.response.data,
                    { status: error.response.status || 500 }
                );
            } else if (error.request) {
                return NextResponse.json(
                    { code: 'SERVER_ERROR', message: '서버에서 응답이 없습니다.' },
                    { status: 500 }
                );
            } else {
                return NextResponse.json(
                    { code: 'REQUEST_ERROR', message: error.message || '요청 중 오류가 발생했습니다.' },
                    { status: 500 }
                );
            }
        }
        return NextResponse.json(
            { code: 'SERVER_ERROR', message: '서버에서 응답이 없습니다.' },
            { status: 500 }
        );
    }
}