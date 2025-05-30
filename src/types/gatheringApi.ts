/**
 * 모임 API 파라미터
 * @type {string | null} token 토큰
 * @type {function} onErrorCallback 에러 콜백 함수 (모달에 표시할 메세지를 전달 받음)
 */
export interface GatheringApiParams {
    token: string | null;
    onErrorCallback?: (msg: string) => void;
}