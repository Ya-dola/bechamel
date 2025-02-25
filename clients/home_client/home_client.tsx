'use client';

import { Button, Card, Text, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthenticatedPage from '@/components/authenticated_page/authenticated_page';
import { useAuthStore } from '@/stores/auth_store';

export default function HomeClient() {
  const router = useRouter();
  const { session, signOut } = useAuthStore();

  // Defensive extraction of session-level info
  const sessionInfo = [
    { label: 'Access Token', value: session?.access_token ?? 'N/A' },
    { label: 'Expires In', value: session?.expires_in?.toString() ?? 'N/A' },
    { label: 'Token Type', value: session?.token_type ?? 'N/A' },
    { label: 'Refresh Token', value: session?.refresh_token ?? 'N/A' },
  ];

  // Defensive extraction of user-level info
  const user = session?.user;
  const userInfo = user
    ? [
        { label: 'User ID', value: user.id ?? 'N/A' },
        { label: 'Email', value: user.email ?? 'N/A' },
        { label: 'Aud', value: user.aud ?? 'N/A' },
        { label: 'Role', value: user.app_metadata?.role ?? 'N/A' },
        { label: 'Created At', value: user.created_at ?? 'N/A' },
        { label: 'Updated At', value: user.updated_at ?? 'N/A' },
        {
          label: 'User Metadata',
          value: user.user_metadata
            ? JSON.stringify(user.user_metadata, null, 2)
            : 'N/A',
        },
        {
          label: 'App Metadata',
          value: user.app_metadata
            ? JSON.stringify(user.app_metadata, null, 2)
            : 'N/A',
        },
      ]
    : [];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthenticatedPage>
      <div className='flex flex-col items-center justify-center min-h-screen px-6 py-12 space-y-6 bg-black text-white'>
        <Title
          order={1}
          className='text-3xl font-bold'
        >
          Home
        </Title>
        <div className='grid grid-cols-1 gap-4 w-full max-w-4xl'>
          {sessionInfo.map((info, index) => (
            <Card
              key={`session-${index}`}
              shadow='sm'
              padding='lg'
              className='bg-gray-800 text-white'
            >
              <Text
                size='lg'
                fw={500}
              >
                {info.label}
              </Text>
              <Text size='sm'>{info.value}</Text>
            </Card>
          ))}
          {userInfo.map((info, index) => (
            <Card
              key={`user-${index}`}
              shadow='sm'
              padding='lg'
              className='bg-gray-800 text-white'
            >
              <Text
                size='lg'
                fw={500}
              >
                {info.label}
              </Text>
              <Text size='sm'>
                {typeof info.value === 'string'
                  ? info.value
                  : info.value.toString()}
              </Text>
            </Card>
          ))}
        </div>
        <div className='flex flex-col gap-4 w-full max-w-md'>
          <Button
            onClick={handleSignOut}
            variant='outline'
            color='red'
            className='w-full'
          >
            Sign Out
          </Button>
          <Button
            component={Link}
            href='/'
            variant='outline'
            color='blue'
            className='w-full'
          >
            Back to Main
          </Button>
        </div>
      </div>
    </AuthenticatedPage>
  );
}
