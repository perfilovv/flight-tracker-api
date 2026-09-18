import { ApiError } from '@/shared/api/client';
import { Toaster } from '@/shared/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && [400, 401, 404].includes(error.status)) {
          return false;
        }

        return failureCount < 2;
      },
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position='top-right' />
    </QueryClientProvider>
  );
}

