'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@mantine/core';
import { useAuthStore } from '@/stores/auth_store';

interface AuthenticatedPageProps {
  children: React.ReactNode;
}

export default function AuthenticatedPage({
  children,
}: AuthenticatedPageProps) {
  const router = useRouter();
  const { session, fetchSession, subscribe } = useAuthStore();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    console.log('AuthenticatedPage: fetching session...');
    // Always fetch session on mount.
    fetchSession().then(() => {
      setLocalLoading(false);
    });
    const unsubscribe = subscribe();
    console.log('AuthenticatedPage: subscribed to auth state changes');
    return () => {
      console.log('AuthenticatedPage: unsubscribing from auth state changes');
      unsubscribe();
    };
  }, [fetchSession, subscribe]);

  useEffect(() => {
    // Once loading is done, if no session exists, redirect.
    if (!localLoading && !session) {
      console.log(
        'AuthenticatedPage: no session after fetch, redirecting to /login',
      );
      router.push('/landing_page');
    }
  }, [localLoading, session, router]);

  if (localLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader
          color={'#DBCDF0'}
          size={'lg'}
        />
      </div>
    );
  }

  return <>{children}</>;
}
