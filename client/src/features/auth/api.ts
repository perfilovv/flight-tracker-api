import { apiClient } from '@/shared/api/client';
import type { User } from './store';

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthRequest {
  email: string;
  password: string;
}

export const login = (data: AuthRequest) =>
  apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
  });

export const register = (data: AuthRequest) =>
  apiClient<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
  });

