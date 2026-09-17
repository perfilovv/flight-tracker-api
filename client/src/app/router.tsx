import { ProtectedRoute } from '@/features/auth/guards/ProtectedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { FlightsList } from '@/features/flights/components/FlightsList';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [{ index: true, element: <FlightsList /> }],
  },
]);

