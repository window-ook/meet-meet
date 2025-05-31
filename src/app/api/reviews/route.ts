import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

/**
 * 리뷰 목록 조회 API
 * @param request
 * @returns 필터 및 정렬 조건에 따른 리뷰 목록
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 외부 API 호출 (백엔드 서버의 리뷰 API)
    const response = await axios.get(`${process.env.API_URI_DEV}/reviews`, {
      params: Object.fromEntries(searchParams),
      headers: {
        Authorization: request.headers.get('Authorization') || '',
      },
    });

    // 성공 응답 반환
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('리뷰 목록 조회 중 오류 발생:', error);

    // 에러 핸들링: axios 에러 처리
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('서버 응답 상태:', error.response.status);
        console.error('서버 응답 데이터:', error.response.data);
        return NextResponse.json(error.response.data, {
          status: error.response.status || 500,
        });
      } else if (error.request) {
        console.error('요청은 성공했으나 응답이 없음');
        return NextResponse.json(
          { code: 'SERVER_ERROR', message: '서버에서 응답이 없습니다.' },
          { status: 500 },
        );
      } else {
        console.error('요청 설정 오류:', error.message);
        return NextResponse.json(
          { code: 'REQUEST_ERROR', message: error.message },
          { status: 500 },
        );
      }
    }

    // 알 수 없는 오류
    return NextResponse.json(
      { code: 'UNKNOWN_ERROR', message: '알 수 없는 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}

/**
 * 리뷰 생성 API
 * @param request - 요청 객체
 * @returns 생성된 리뷰 데이터 또는 에러 메시지
 */
export async function POST(request: NextRequest) {
  try {
    const { gatheringId, score, comment } = await request.json();
    const token = request.headers.get('Authorization');

    if (request.headers.get('Authorization') === null) {
      return NextResponse.json(
        { code: 'UNAUTHORIZED', message: '토큰이 없습니다.' },
        { status: 401 }
      );
    }

    const response = await axios.post(
      `${process.env.API_URI_DEV}/reviews`,
      { gatheringId, score, comment },
      { headers: { Authorization: token } }
    );

    return NextResponse.json(response.data);

  } catch (error) {
    console.error('리뷰 생성 중 오류:', error);

    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    }

    return NextResponse.json(
      { code: 'SERVER_ERROR', message: '리뷰 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}