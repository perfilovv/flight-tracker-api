import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFlight, getFlights } from '../api';
import { toast } from 'sonner';
import { ApiError } from '@/shared/api/client';
import { useSocket } from '@/shared/socket/useSocket';

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
  const { socket } = useSocket();

  return useMutation({
    mutationFn: createFlight,
    onSuccess: () => {
      toast.success('Рейс успешно создан');

      if (!socket?.connected) {
        queryClient.invalidateQueries({ queryKey: FLIGHTS_QUERY_KEY });
      }
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : 'Не удалось создать рейс';
      toast.error(message);
    },
  });
}

