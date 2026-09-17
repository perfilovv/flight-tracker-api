import { LoginForm } from '../components/LoginForm';
import { Link } from 'react-router';

export function LoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div>
        <h1 className='text-2xl font-semibold mb-6'>Вход</h1>
        <LoginForm />
        <p className='mt-4 text-sm text-muted-foreground'>
          Нет аккаунта?{' '}
          <Link to='/register' className='underline'>
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}

