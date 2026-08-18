import type { User } from './store';

const API_URL = import.meta.env.VITE_API_URL;

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthRequest {
  email: string;
  password: string;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function authRequest(path: string, body: unknown): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, (await data.message) ?? 'Что-то пошло не так');
  }

  return res.json();
}

export const login = (data: AuthRequest) => authRequest('login', data);

export const register = (data: AuthRequest) => authRequest('register', data);

