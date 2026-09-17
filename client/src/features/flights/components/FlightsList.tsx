import { useFlights } from '../hooks/useFlights';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Badge } from '@/shared/components/ui/badge';
import { FlightFormDialog } from './FlightFormDialog';
import { Button } from '@/shared/components/ui/button';
import { useState } from 'react';

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  scheduled: 'secondary',
  delayed: 'destructive',
  departed: 'default',
};

export function FlightsList() {
  const [page, setPage] = useState(1);
  const { data: flights, isLoading, isError } = useFlights(page);

  const hasMore = flights ? flights.offset + flights.data.length < flights.total : false;

  if (isLoading) {
    return (
      <div className='space-y-2 p-6'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className='h-12 w-full' />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-6 text-center text-red-500'>Не удалось загрузить рейсы. Попробуйте обновить страницу.</div>
    );
  }

  if (!flights || !flights.data.length) {
    return (
      <div className='p-6 text-center'>
        <p className='text-muted-foreground mb-4'>Пока нет ни одного рейса</p>
        <FlightFormDialog />
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-semibold'>Рейсы</h1>
        <FlightFormDialog />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Рейс</TableHead>
            <TableHead>Откуда</TableHead>
            <TableHead>Куда</TableHead>
            <TableHead>Вылет</TableHead>
            <TableHead>Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flights.data.map((flight) => (
            <TableRow key={flight.id}>
              <TableCell className='font-medium'>{flight.flightNumber}</TableCell>
              <TableCell>{flight.origin}</TableCell>
              <TableCell>{flight.destination}</TableCell>
              <TableCell>{new Date(flight.departureTime).toLocaleString('ru-RU')}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[flight.status] ?? 'secondary'}>{flight.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className='flex items-center justify-between mt-4'>
        <p className='text-sm text-muted-foreground'>
          Показано {flights.data.length} из {flights?.total ?? 0}
        </p>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm' disabled={page === 1} onClick={() => setPage((page) => page - 1)}>
            Назад
          </Button>
          <Button variant='outline' size='sm' disabled={!hasMore} onClick={() => setPage((page) => page + 1)}>
            Далее
          </Button>
        </div>
      </div>
    </div>
  );
}

