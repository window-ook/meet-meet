import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';

/**
 * API 결과 타입을 지정할 수 있는 커스텀 훅
 */
export function useFilteredGatherings<T = unknown>(
  apiUrl: string,
  filterState: {
    filter: { category: string; type: string };
    selectedLocation: string;
    selectedDate: string;
    sortBy: string;
  },
  token?: string
): UseQueryResult<T, Error> {
  const { filter, selectedLocation, selectedDate, sortBy } = filterState;

  const queryFn = async (): Promise<T> => {
    const params: Record<string, string> = {};

    if (filter.category === 'WORKATION') {
      params.type = 'WORKATION';
    } else if (filter.type !== 'ALL') {
      params.type = filter.type;
    }
    if (selectedLocation) params.location = selectedLocation;
    if (selectedDate) params.date = selectedDate;
    if (sortBy) {
      params.sortBy = sortBy;
      params.sortOrder = 'desc';
    }

    const res = await axios.get(apiUrl, {
      params,
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    });

    return res.data as T;
  };

  return useQuery<T, Error>({
    queryKey: ['filteredData', filter, selectedLocation, selectedDate, sortBy],
    queryFn,
  });
}
