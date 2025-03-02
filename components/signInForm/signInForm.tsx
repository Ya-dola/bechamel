'use client';

import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import CustomTextInput from '@/components/customTextInput/customTextInput';
import CustomPasswordInput from '@/components/customPasswordInput/customPasswordInput';
import { signIn } from '@/services/supabase_auth_service';
import GradientCard from '@/components/gradientCard/gradientCard';
import CustomImage from '@/components/customImage/customImage';

interface SignInFormValues {
  email: string;
  password: string;
}

function SignInForm() {
  const { control, handleSubmit } = useForm<SignInFormValues>({
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });
  const router = useRouter();
  const [formError, setFormError] = useState<string>('');

  const onSubmit = async (values: SignInFormValues) => {
    const { email, password } = values;
    setFormError('');
    const result = await signIn(email, password);
    if (result.error) {
      setFormError(result.error.message);
    } else {
      router.push('/home_page');
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
          <h1 className='text-3xl font-bold'>Welcome Back</h1>
          <p className='text-slate-400 font-extralight text-sm'>
            Enter your details to sign in!
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
                // Pass the external error from react-hook-form only when the field is empty.
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
                error={fieldState.error?.message}
                withAsterisk
              />
            )}
          />
          <Link
            href='/forgotPassword'
            className='text-violet-500 underline w-full text-right text-sm mt-[-1.5rem]'
          >
            Forgot Password
          </Link>
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
            Sign in
          </button>
        </form>

        <p className='text-slate-400 font-extralight text-sm w-full text-center'>
          Don&apos;t have an account?
          <Link
            href='/signUp'
            className='text-violet-500 underline ml-1'
          >
            Sign Up
          </Link>
        </p>
      </div>

      <GradientCard
        className={'h-fit w-4xl rounded-xl gap-12'}
        padding={'px-8 py-24'}
      >
        <CustomImage
          imageSrc={
            'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png'
          }
        />
        <p className='text-2xl font-bold text-white text-center'>
          Manage and Share Recipes!
        </p>
      </GradientCard>
    </div>
  );
}

export default SignInForm;
