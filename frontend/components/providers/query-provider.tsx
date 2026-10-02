'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Keep query data fresh for one minute.
            gcTime: 10 * 60 * 1000, // Keep inactive queries cached for ten minutes.
            refetchOnWindowFocus: false, // Avoid refetching when the browser tab regains focus.
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
