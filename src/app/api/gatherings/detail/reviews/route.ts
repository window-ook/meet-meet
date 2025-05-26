import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

/**
 * 모임 리뷰 목록 조회
 * @param request 
 * @method GET
 * @returns 모임 리뷰 목록
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    try {
        if (!id) {
            return NextResponse.json(
                { error: '모임 id가 필요합니다.' },
                { status: 400 }
            );
        }

        const response = await axios.get(`${process.env.API_URI_DEV}/reviews`, { params: { teamId: process.env.TEAM_ID_DEV, id } });
        return new NextResponse(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        const err = error as AxiosError;
        return new NextResponse(JSON.stringify({ error: err?.response?.data }), { status: 500 });
    }
}