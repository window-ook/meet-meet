import { create } from 'zustand';
import { Gathering } from '@/types/gatherings';

/**
 * SSR 모임 목록
 * @type {Gathering[]} gatherings 모임 목록
 * @type {function} setGatherings 모임 목록 설정 함수
 * @type {function} removeGathering 모임 삭제 함수
 */
interface GatheringsState {
    gatherings: Gathering[];
    setGatherings: (gatherings: Gathering[]) => void;
    removeGathering: (id: number) => void;
}

export const useGatheringsStore = create<GatheringsState>((set) => ({
    gatherings: [],
    setGatherings: (gatherings) => set({ gatherings }),
    removeGathering: (id) =>
        set((state) => ({
            gatherings: state.gatherings.filter((g) => g.id !== id),
        })),
}));