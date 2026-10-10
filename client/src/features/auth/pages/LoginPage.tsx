import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { LoginForm } from '../components/LoginForm';
import { Link } from 'react-router';

export function LoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center px-4s'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='font-bold text-[32px]'>Flight Track</CardTitle>
          <CardDescription>Войдите, чтобы управлять расписанием рейсов.</CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />

          <p className='mt-4 text-center text-sm text-muted-foreground'>
            Нет аккаунта?{' '}
            <Link to='/register' className='underline underline-offset-4'>
              Зарегистрироваться
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

