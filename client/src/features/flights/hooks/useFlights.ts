import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFlight, getFlights } from '../api';

export const FLIGHTS_QUERY_KEY = ['flights'] as const;

export function useFlights(page = 1) {
  return useQuery({
    queryKey: [...FLIGHTS_QUERY_KEY, page],
    queryFn: () => getFlights(page),
    placeholderData: (prev) => prev,
  });
}

export function useCreateFlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FLIGHTS_QUERY_KEY });
    },
  });
}

