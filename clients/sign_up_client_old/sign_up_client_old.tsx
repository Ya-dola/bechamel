'use client';

import { useForm } from 'react-hook-form';
import { Button, TextInput, PasswordInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/services/supabase_auth_service';

interface SignupFormValues {
  email: string;
  password: string;
}

export default function SignUpClientOld() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormValues>();
  const router = useRouter();

  const onSubmit = async (values: SignupFormValues) => {
    const { email, password } = values;
    const result = await signUp(email, password);
    if (result.error) {
      setError('email', { message: result.error.message });
    } else {
      router.push('/home');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-12 space-y-6 bg-black text-white'>
      <h1 className='text-3xl font-bold'>Sign Up</h1>
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
          Sign Up
        </Button>
      </form>
      <p>
        Already have an account?{' '}
        <Link
          href='/login'
          className='text-blue-500 underline'
        >
          Login
        </Link>
      </p>
    </div>
  );
}
