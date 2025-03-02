'use client';

import { useForm } from 'react-hook-form';
import { Button, TextInput, PasswordInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/services/supabase_auth_service';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginClientOld() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>();
  const router = useRouter();

  console.log('LoginClient rendered');

  const onSubmit = async (values: LoginFormValues) => {
    console.log('Login form submitted with values:', values);
    const { email, password } = values;
    const result = await signIn(email, password);
    if (result.error) {
      console.log('Sign in error:', result.error.message);
      setError('email', { message: result.error.message });
    } else {
      console.log('Sign in result:', result.data);
      router.push('/home');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-12 space-y-6 bg-black text-white'>
      <h1 className='text-3xl font-bold'>Login</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4 w-full max-w-md'
      >
        <TextInput
          label='Email'
          placeholder='Enter your email'
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
          variant='filled'
          className='w-full'
        />
        <PasswordInput
          label='Password'
          placeholder='Enter your password'
          {...register('password', { required: 'Password is required' })}
          error={errors.password?.message}
          variant='filled'
          className='w-full'
        />
        <Button
          type='submit'
          variant='filled'
          color='blue'
          className='w-full'
        >
          Login
        </Button>
      </form>
      <p>
        Don&apos;t have an account?
        <Link
          href='/sign_up_old'
          className='text-blue-500 underline'
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
