import { useNavigate } from 'react-router';
import { useAuthStore } from '../store';
import { useForm } from 'react-hook-form';
import { registerSchema, type RegisterFormData } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { register } from '../api';
import { Input } from '@base-ui/react/input';
import { Button } from '@base-ui/react/button';
import { ApiError } from '@/shared/api/client';

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
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className='space-y-4 max-w-sm'>
      <div>
        <Input type='email' placeholder='Email' {...registerField('email')} />
        {errors.email && <p className='text-sm text-red-500 mt-1'>{errors.email.message}</p>}
      </div>

      <div>
        <Input type='password' placeholder='Пароль (минимум 8 символов)' {...registerField('password')} />
        {errors.password && <p className='text-sm text-red-500 mt-1'>{errors.password.message}</p>}
      </div>

      {errorMessage && <p className='text-sm text-red-500'>{errorMessage}</p>}

      <Button type='submit' disabled={mutation.isPending} className='w-full'>
        {mutation.isPending ? 'Регистрируем...' : 'Зарегистрироваться'}
      </Button>
    </form>
  );
}

