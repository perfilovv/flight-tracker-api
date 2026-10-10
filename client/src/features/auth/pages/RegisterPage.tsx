import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Link } from 'react-router';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='font-bold text-[32px]'>Flight Track</CardTitle>
          <CardDescription>Создайте аккаунт, чтобы управлять расписанием рейсов.</CardDescription>
        </CardHeader>

        <CardContent>
          <RegisterForm />

          <p className='mt-4 text-center text-sm text-muted-foreground'>
            Уже есть аккаунт?{' '}
            <Link to='/login' className='underline underline-offset-4'>
              Войти
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

