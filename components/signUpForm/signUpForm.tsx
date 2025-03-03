'use client';

import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import CustomTextInput from '@/components/customTextInput/customTextInput';
import CustomPasswordInput from '@/components/customPasswordInput/customPasswordInput';
import GradientCard from '@/components/gradientCard/gradientCard';
import CustomImage from '@/components/customImage/customImage';
import { signUp } from '@/services/supabase_auth_service';
import LogoImage from '../logoImage/logoImage';

interface SignUpFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

function SignUpForm() {
  const { control, handleSubmit, watch, setError } = useForm<SignUpFormValues>({
    defaultValues: { email: '', password: '', confirmPassword: '' },
    mode: 'onChange',
  });
  const router = useRouter();
  const [formError, setFormError] = useState<string>('');

  const onSubmit = async (values: SignUpFormValues) => {
    const { email, password, confirmPassword } = values;
    setFormError('');

    // Check if both password fields match
    if (password !== confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    const result = await signUp(email, password);
    if (result.error) {
      setFormError(result.error.message);
    } else {
      router.push('/home_page');
    }
  };

  return (
    <div
      className='flex flex-row items-center w-6xl min-h-80
      px-8 py-12 space-y-6 bg-white rounded-2xl gap-x-24'
    >
      <div className='flex flex-col gap-6 w-full'>
        <div className='flex flex-row flex-wrap gap-2 items-center'>
          <LogoImage width={36} />

          <p>KoiPad</p>
        </div>
        <div className='flex flex-col gap-1'>
          <h1 className='text-3xl font-bold'>Create Your Account</h1>
          <p className='text-slate-400 font-extralight text-sm'>
            Enter your details to sign up!
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
          <Controller
            name='password'
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field, fieldState }) => (
              <CustomPasswordInput
                label='Password'
                placeholder='Enter your password'
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
              required: 'Confirm password is required',
              validate: (value) =>
                value === watch('password') || 'Passwords do not match',
            }}
            render={({ field, fieldState }) => (
              <CustomPasswordInput
                label='Confirm Password'
                placeholder='Re-enter your password'
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
            className={`rounded-xl transition-colors flex items-center 
              justify-center text-sm sm:text-base h-10 sm:h-10 
              px-4 sm:px-5 sm:min-w-44 hover:border
              bg-violet-300 hover:bg-white hover:border-violet-400`}
          >
            Sign Up
          </button>
        </form>
        <p className='text-slate-400 font-extralight text-sm w-full text-center'>
          Already have an account?
          <Link
            href='/signIn'
            className='text-violet-500 underline ml-1'
          >
            Sign In
          </Link>
        </p>
      </div>

      <GradientCard
        gradient={'bg-gradient-to-b from-violet-300 to-emerald-300 to-90%'}
        className={'h-fit w-4xl rounded-xl gap-12'}
        padding={'px-8 py-24'}
      >
        <CustomImage imageSrc='/images/1.png' />
        <p className='text-2xl font-bold text-white text-center'>
          Manage and Share Recipes!
        </p>
      </GradientCard>
    </div>
  );
}

export default SignUpForm;
