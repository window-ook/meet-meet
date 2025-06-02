/**
 * 한국 시간대로 변환하는 공용 함수
 */
export function toKoreanTime(date: Date | string): Date {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // UTC 시간에 9시간 더해서 한국 시간으로 변환
    const utcTime = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
    const koreanTime = new Date(utcTime + (9 * 3600000));
    
    return koreanTime;
}

/** 
 * 날짜 형식 변환
 */
export function formatDate(dateTime: string) {
    if (!dateTime) return '';
    
    try {
        const date = new Date(dateTime);
        if (isNaN(date.getTime())) return '';
        
        // 한국 시간으로 변환
        const koreanDate = toKoreanTime(date);
        
        const year = koreanDate.getFullYear();
        const month = String(koreanDate.getMonth() + 1).padStart(2, '0');
        const day = String(koreanDate.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('formatDate error:', error);
        return '';
    }
}

/** 
 * 시간 형식 변환
 */
export function formatTime(dateTime: string) {
    if (!dateTime) return '';
    
    try {
        const date = new Date(dateTime);
        if (isNaN(date.getTime())) return '';
        
        // 한국 시간으로 변환
        const koreanDate = toKoreanTime(date);
        
        const hours = String(koreanDate.getHours()).padStart(2, '0');
        const minutes = String(koreanDate.getMinutes()).padStart(2, '0');
        
        return `${hours}:${minutes}`;
    } catch (error) {
        console.error('formatTime error:', error);
        return '';
    }
}

/**
 * 마감시간 계산
 */
export const getTimeRemaining = (registrationEnd: string) => {
    if (!registrationEnd) return '마감됨';
    
    try {
        const end = new Date(registrationEnd);
        const now = new Date();
        
        if (isNaN(end.getTime())) return '마감됨';
        
        // 한국 시간으로 변환
        const koreanEnd = toKoreanTime(end);
        const koreanNow = toKoreanTime(now);
        
        const diff = koreanEnd.getTime() - koreanNow.getTime();

        // 이미 마감된 경우
        if (diff <= 0) {
            return '마감됨';
        }

        // 날짜 차이 계산
        const endDate = new Date(koreanEnd.getFullYear(), koreanEnd.getMonth(), koreanEnd.getDate());
        const nowDate = new Date(koreanNow.getFullYear(), koreanNow.getMonth(), koreanNow.getDate());
        const daysDiff = Math.ceil((endDate.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24));

        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        // 1일 이상 남은 경우
        if (daysDiff > 0) {
            return `${daysDiff}일 후 마감`;
        }

        // 당일인 경우 시간으로 표시
        if (hours > 0) {
            return `${hours}시간 후 마감`;
        }

        if (minutes > 0) {
            return `${minutes}분 후 마감`;
        }

        return '곧 마감';
    } catch (error) {
        console.error('getTimeRemaining error:', error);
        return '마감됨';
    }
};