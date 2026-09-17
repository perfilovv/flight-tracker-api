import { useAuthStore } from '@/features/auth/store';

const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth, headers, ...rest } = options;
  const token = useAuthStore.getState().token;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (res.status === 401 && !skipAuth) {
    useAuthStore.getState().clearAuth();

    window.location.href = '/login';
    throw new ApiError(res.status, 'Unauthorized');
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data.error ?? data.message ?? 'Something went wrong');
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

