import { RegisterForm } from '../components/RegisterForm';
import { Link } from 'react-router';

export function RegisterPage() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div>
        <h1 className='text-2xl font-semibold mb-6'>Регистрация</h1>
        <RegisterForm />
        <p className='mt-4 text-sm text-muted-foreground'>
          Уже есть аккаунт?{' '}
          <Link to='/login' className='underline'>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
