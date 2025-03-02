'use client';

import { useForm, Controller } from 'react-hook-form';
import Link from 'next/link';
import { useState } from 'react';
import CustomTextInput from '@/components/customTextInput/customTextInput';
import GradientCard from '@/components/gradientCard/gradientCard';
import CustomImage from '@/components/customImage/customImage';
import { supabase } from '@/services/supabase_service';

interface ForgotPasswordFormValues {
  email: string;
}

function ForgotPasswordForm() {
  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: '' },
    mode: 'onChange',
  });
  const [formError, setFormError] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setFormError('');
    if (isSending) return;
    setIsSending(true);
    // Send a password recovery email using Supabase's API.
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      // Adjust redirectTo to point to your reset password page.
      redirectTo: window.location.origin + '/resetPassword',
    });
    if (error) {
      setFormError(error.message);
      setIsSending(false);
    } else {
      // Rate limit for 5 minutes (300 seconds)
      setTimer(300);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsSending(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
          <h1 className='text-3xl font-bold'>Forgot Password</h1>
          <p className='text-slate-400 font-extralight text-sm'>
            Enter your email to receive a password recovery link.
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-8 w-full'
        >
          <Controller
            name='email'
            control={control}
            rules={{ required: 'Email is required' }}
            render={({ field, fieldState }) => (
              <CustomTextInput
                label='Email'
                placeholder='Enter your email'
                type='email'
                value={field.value}
                onValueChange={(val) => {
                  setFormError('');
                  field.onChange(val);
                }}
                // Show external error (like "Email is required") when empty;
                // otherwise, inline validation (e.g. "Invalid email address") will display.
                externalError={
                  field.value.trim() === ''
                    ? fieldState.error?.message
                    : undefined
                }
                withAsterisk
                clearable
              />
            )}
          />
          {formError && (
            <p className='text-red-500 text-sm text-center'>{formError}</p>
          )}
          <button
            type='submit'
            className='rounded-xl transition-colors flex items-center justify-center text-sm sm:text-base h-10 sm:h-10 px-4 sm:px-5 sm:min-w-44 hover:border bg-violet-300 hover:bg-white hover:border-violet-400'
            disabled={isSending}
          >
            {isSending ? `Please wait ${timer}s` : 'Send Recovery Email'}
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

export default ForgotPasswordForm;
