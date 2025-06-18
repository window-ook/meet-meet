/** 엔티티 디코딩 함수
 * @param text 디코딩할 텍스트
 * @returns 디코딩된 텍스트
 * @description html 엔티티를 치환하기 위한 함수. 공백이 있는 경우도 처리
 */
export const decodeHtmlEntities = (text: string): string => {
    if (!text) return '';

    const entities: { [key: string]: string } = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&apos;': "'",
        '&#40;': '(',
        '&#41;': ')',
        '& #39;': "'",  // 공백이 있는 경우도 처리
        '& #40;': '(',
        '& #41;': ')'
    };

    return text.replace(/&[#\w]+;|& #\d+;/g, entity => {
        if (entity.startsWith('&#')) {
            const code = entity.replace(/[&#;]/g, '');
            return String.fromCharCode(parseInt(code, 10));
        }

        return entities[entity] || entity;
    });
} 