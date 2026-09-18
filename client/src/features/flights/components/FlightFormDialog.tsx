import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { flightSchema, type FlightFormData } from '../schemas';
import { useCreateFlight } from '../hooks/useFlights';
import { ApiError } from '@/shared/api/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

export function FlightFormDialog() {
  const [open, setOpen] = useState(false);
  const mutation = useCreateFlight();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FlightFormData>({
    resolver: zodResolver(flightSchema),
  });

  const onSubmit = (data: FlightFormData) => {
    mutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  const errorMessage = mutation.error instanceof ApiError ? mutation.error.message : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Добавить рейс</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый рейс</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <Label htmlFor='flightNumber'>Номер рейса</Label>
            <Input id='flightNumber' {...register('flightNumber')} />
            {errors.flightNumber && <p className='text-sm text-red-500 mt-1'>{errors.flightNumber.message}</p>}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='origin'>Откуда</Label>
              <Input id='origin' {...register('origin')} />
              {errors.origin && <p className='text-sm text-red-500 mt-1'>{errors.origin.message}</p>}
            </div>
            <div>
              <Label htmlFor='destination'>Куда</Label>
              <Input id='destination' {...register('destination')} />
              {errors.destination && <p className='text-sm text-red-500 mt-1'>{errors.destination.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor='departureTime'>Вылет</Label>
            <Input id='departureTime' type='datetime-local' {...register('departureTime')} />
            {errors.departureTime && <p className='text-sm text-red-500 mt-1'>{errors.departureTime.message}</p>}
          </div>

          <div>
            <Label htmlFor='arrivalTime'>Прилёт</Label>
            <Input id='arrivalTime' type='datetime-local' {...register('arrivalTime')} />
            {errors.arrivalTime && <p className='text-sm text-red-500 mt-1'>{errors.arrivalTime.message}</p>}
          </div>

          {errorMessage && <p className='text-sm text-red-500'>{errorMessage}</p>}

          <Button type='submit' disabled={mutation.isPending} className='w-full'>
            {mutation.isPending ? 'Создаём...' : 'Создать рейс'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

