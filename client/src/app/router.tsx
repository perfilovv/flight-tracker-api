import { LoginForm } from '@/features/auth/components/LoginForm';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginForm />,
  },
]);

