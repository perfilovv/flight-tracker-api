import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/shared/socket/useSocket';
import { type Flight } from '../api';
import { FLIGHTS_QUERY_KEY } from './useFlights';
import { toast } from 'sonner';

export function useFlightUpdates(flightIds: string[]) {
  const { socket, status } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !flightIds.length) return;

    flightIds.forEach((id) => socket.emit('flights:subscribe', id));

    const handleUpdate = (flight: Flight) => {
      queryClient.invalidateQueries({ queryKey: FLIGHTS_QUERY_KEY });
      toast.info(`Рейс ${flight.flightNumber} обновлён: ${flight.status}`);
    };

    const handleCreated = (flight: Flight) => {
      queryClient.invalidateQueries({
        queryKey: FLIGHTS_QUERY_KEY,
      });
      toast.success(`Новый рейс добавлен: ${flight.flightNumber}`);
    };

    socket.on('flight:updated', handleUpdate);
    socket.on('flight:created', handleCreated);

    return () => {
      socket.off('flight:updated', handleUpdate);
      socket.off('flight:created', handleCreated);
    };
  }, [socket, flightIds, queryClient]);

  return { status };
}

