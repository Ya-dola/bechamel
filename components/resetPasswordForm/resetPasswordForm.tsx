'use client';

import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import CustomPasswordInput from '@/components/customPasswordInput/customPasswordInput';
import GradientCard from '@/components/gradientCard/gradientCard';
import CustomImage from '@/components/customImage/customImage';
import { supabase } from '@/services/supabase_service';

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

function ResetPasswordForm() {
  const { control, handleSubmit, watch, setError } =
    useForm<ResetPasswordFormValues>({
      defaultValues: { password: '', confirmPassword: '' },
      mode: 'onChange',
    });
  const router = useRouter();
  const [formError, setFormError] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    let token: string | null = null;
    // First check query params
    const searchParams = new URLSearchParams(window.location.search);
    token = searchParams.get('token');
    // If not found, check the hash (after #)
    if (!token) {
      const hash = window.location.hash.substring(1); // remove the #
      const hashParams = new URLSearchParams(hash);
      token = hashParams.get('access_token');
    }
    setAccessToken(token);
  }, []);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    const { password, confirmPassword } = values;
    setFormError('');
    if (password !== confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    if (!accessToken) {
      setFormError('No access token provided.');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setFormError(error.message);
    } else {
      router.push('/signIn');
    }
  };

  return (
    <div
      className='flex flex-row items-center w-6xl min-h-196
     px-8 py-12 space-y-6 border-2 border-slate-400 rounded-2xl gap-x-24'
    >
      <div className='flex flex-col gap-6 w-full'>
        <div className='flex flex-row flex-wrap gap-2 items-center'>
          <div className='w-8 h-8 rounded-full bg-gray-400' />
          <p>KoiPad</p>
        </div>
        <div className='flex flex-col gap-1'>
          <h1 className='text-3xl font-bold'>Reset Password</h1>
          <p className='text-slate-400 font-extralight text-sm'>
            Enter your new password.
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-8 w-full'
        >
          <Controller
            name='password'
            control={control}
            rules={{ required: 'New password is required' }}
            render={({ field, fieldState }) => (
              <CustomPasswordInput
                label='New Password'
                placeholder='Enter new password'
                value={field.value}
                onValueChange={(val) => {
                  setFormError('');
                  field.onChange(val);
                }}
                withAsterisk
                error={fieldState.error?.message}
                showPopover
              />
            )}
          />
          <Controller
            name='confirmPassword'
            control={control}
            rules={{
              required: 'Please confirm your password',
              validate: (value) =>
                value === watch('password') || 'Passwords do not match',
            }}
            render={({ field, fieldState }) => (
              <CustomPasswordInput
                label='Confirm Password'
                placeholder='Re-enter new password'
                value={field.value}
                onValueChange={(val) => {
                  setFormError('');
                  field.onChange(val);
                }}
                withAsterisk
                error={fieldState.error?.message}
                showPopover={false}
              />
            )}
          />
          {formError && (
            <p className='text-red-500 text-sm text-center'>{formError}</p>
          )}
          <button
            type='submit'
            className={`rounded-xl transition-colors flex items-center justify-center text-sm sm:text-base h-10 sm:h-10 px-4 sm:px-5 sm:min-w-44 hover:border bg-violet-300 hover:bg-white hover:border-violet-400`}
          >
            Reset Password
          </button>
        </form>
        <p className='text-slate-400 font-extralight text-sm w-full text-center'>
          Remember your password?
          <Link
            href='/signIn'
            className='text-violet-500 underline ml-1'
          >
            Sign In
          </Link>
        </p>
      </div>

      <GradientCard
        className='h-fit w-4xl rounded-xl gap-12'
        padding='px-8 py-24'
      >
        <CustomImage imageSrc='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png' />
        <p className='text-2xl font-bold text-white text-center'>
          Manage and Share Recipes!
        </p>
      </GradientCard>
    </div>
  );
}

export default ResetPasswordForm;
