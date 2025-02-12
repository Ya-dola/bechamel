'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function NotFound() {
  const router = useRouter();

  // Redirect to the main page if a page is not found
  useEffect(() => {
    router.replace('/');
  }, [router]);

  return null;
}

export default NotFound;
