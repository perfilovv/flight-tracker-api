import { useNavigate } from 'react-router';
import { useAuthStore } from '../store';
import { useForm } from 'react-hook-form';
import { registerSchema, type RegisterFormData } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { register } from '../api';
import { ApiError } from '@/shared/api/client';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

export function RegisterForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate('/');
    },
  });

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.status === 429
        ? 'Слишком много попыток регистрации. Попробуйте позже.'
        : mutation.error.status === 409
          ? 'Пользователь с таким email уже существует.'
          : 'Не удалось зарегистрироваться.'
      : null;

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className='space-y-4'>
      <div className='grid gap-2'>
        <Label htmlFor='email'>Email</Label>
        <Input id='email' type='email' autoComplete='email' {...registerField('email')} />
        {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
      </div>

      <div className='grid gap-2'>
        <Label htmlFor='password'>Пароль</Label>
        <Input
          id='password'
          type='password'
          autoComplete='new-password'
          placeholder='Минимум 8 символов'
          {...registerField('password')}
        />
        {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
      </div>

      {errorMessage && <p className='text-sm text-red-500'>{errorMessage}</p>}

      <Button type='submit' disabled={mutation.isPending} className='w-full'>
        {mutation.isPending ? 'Регистрируем...' : 'Зарегистрироваться'}
      </Button>
    </form>
  );
}

