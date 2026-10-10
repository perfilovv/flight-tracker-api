import { useNavigate } from 'react-router';
import { useAuthStore } from '../store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../schemas';
import { useMutation } from '@tanstack/react-query';
import { login } from '../api';
import { ApiError } from '@/shared/api/client';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

export function LoginForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate('/');
    },
  });

  const onSubmit = (data: LoginFormData) => mutation.mutate(data);

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.status === 429
        ? 'Слишком много попыток входа. Подождите немного и попробуйте снова.'
        : 'Неверный email или пароль'
      : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid gap-2'>
        <Label htmlFor='email'>Email</Label>
        <Input id='email' type='email' autoComplete='email' {...registerField('email')} />
        {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password'>Пароль</Label>
        <Input id='password' type='password' autoComplete='current-password' {...registerField('password')} />
        {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
      </div>
      {errorMessage && <p className='text-sm text-red-500'>{errorMessage}</p>}

      <Button type='submit' disabled={mutation.isPending} className='w-full'>
        {mutation.isPending ? 'Входим...' : 'Войти'}
      </Button>
    </form>
  );
}

