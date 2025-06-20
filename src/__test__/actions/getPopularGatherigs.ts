import { Gathering } from "@/types/gatherings";

/** actions/getPopularGatherings.ts 모킹 액션 */
export async function getPopularGatherings(): Promise<Gathering[]> {
    const response = await fetch(`/popular-gatherings`);
    const data = await response.json();
    return data;
}