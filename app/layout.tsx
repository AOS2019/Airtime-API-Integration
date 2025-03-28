'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './globals.css';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true only on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      {...(isMounted ? { 'data-qb-installed': 'true' } : {})}
    >
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
