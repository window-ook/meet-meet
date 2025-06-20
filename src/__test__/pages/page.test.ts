import { describe, test, expect } from 'vitest';
import { getPopularGatherings } from '@/__test__/actions/getPopularGatherigs';
import { dateToDateTimeValue, isBefore } from '@/utils/shared/date';

describe('getPopularGatherings 검증', () => {
    test('4개를 성공적으로 반환해야 한다.', async () => {
        const result = await getPopularGatherings();
        expect(result).toHaveLength(4);
    });

    test('모든 모임이 필수 필드를 가지고 있어야 한다.', async () => {
        const result = await getPopularGatherings();

        result.forEach((gathering) => {
            expect(gathering.id, `id 누락`).toBeDefined();
            expect(gathering.name, `name 누락`).toBeTruthy();
            expect(gathering.participantCount, `participantCount 누락`).toBeGreaterThanOrEqual(0);
            expect(gathering.capacity, `capacity 누락`).toBeGreaterThan(0);
            expect(gathering.dateTime, `dateTime 누락`).toBeTruthy();
            expect(gathering.registrationEnd, `registrationEnd 누락`).toBeTruthy();
        });
    });

    test('참여자 수가 정원을 초과하지 않아야 한다.', async () => {
        const result = await getPopularGatherings();

        result.forEach((gathering) => {
            expect(gathering.participantCount, `참여자 수가 정원을 초과했습니다.`).toBeLessThanOrEqual(gathering.capacity);
        });
    });

    test('참여자 수가 많은 순서대로 정렬되어 있어야 한다.', async () => {
        const result = await getPopularGatherings();

        const sortedResult = result.sort((a, b) => b.participantCount - a.participantCount);
        expect(sortedResult).toEqual(result);
    });

    test('모집 기간이 모임 날짜보다 이전이어야 한다.', async () => {
        const result = await getPopularGatherings();

        result.forEach(gathering => {
            const registrationEndValue = dateToDateTimeValue(new Date(gathering.registrationEnd));
            const dateTimeValue = dateToDateTimeValue(new Date(gathering.dateTime));
            expect(isBefore(registrationEndValue, dateTimeValue)).toBe(true);
        });
    });
});