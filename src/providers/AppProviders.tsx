"use client"
import React from 'react'
import ErrorBoundary from '@/components/ErrorBoundary'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from '@/lib/queryClient'
import getSocket from '@/socket/client'
import useAuthStore from '@/store/authStore'
export default function AppProviders({ children }: { children: React.ReactNode }) {
  const userId = useAuthStore((s) => s.user?._id ?? null);

  React.useEffect(() => {
    const socket = getSocket();
    if (userId) {
      socket.emit('connection', { userID: userId });
    }
    return () => {};
  }, [userId]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
