import { Gathering } from '@/types/gatherings';

/**
 * API 응답 데이터를 정규화하여 Gathering 배열로 변환
 * @param response API 응답 객체
 * @returns 정규화된 Gathering 배열
 */
export const normalizeGatheringsResponse = (response: any): Gathering[] => {
    let gatherings = response.data || [];

    if (!Array.isArray(gatherings)) {
        if (response.data?.data) {
            gatherings = response.data.data;
        } else if (response.data?.gatherings) {
            gatherings = response.data.gatherings;
        } else if (response.data?.items) {
            gatherings = response.data.items;
        } else {
            console.error('Unexpected gatherings response format:', response.data);
            return [];
        }
    }

    return gatherings;
};

/**
 * 에러 응답 처리
 * @param error 에러 객체
 * @param context 에러 발생 컨텍스트
 * @returns 빈 배열
 */
export const handleGatheringsError = (error: any, context: string): Gathering[] => {
    console.error(`${context} 에러 발생:`, error);
    
    if (error instanceof Error) {
        console.error('에러 메시지:', error.message);
    }
    
    return [];
};