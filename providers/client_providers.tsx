'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import React from 'react';

const queryClient = new QueryClient();

interface ClientProvidersProps {
  children: React.ReactNode;
  defaultColorScheme?: 'light' | 'dark';
}

function ClientProviders({
  children,
  defaultColorScheme = 'dark',
}: ClientProvidersProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MantineProvider defaultColorScheme={defaultColorScheme}>
          {children}
        </MantineProvider>
      </QueryClientProvider>
    </>
  );
}

export { ClientProviders };
