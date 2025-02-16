'use client';

import { useForm } from 'react-hook-form';
import { TextInput, Button } from '@mantine/core';
import Link from 'next/link';
import { useInsertCategory } from '@/hooks/useInsertCategory';
import { useRouter } from 'next/navigation';

interface CategoryFormValues {
  name: string;
}

function InsertCategoryClient() {
  const { register, handleSubmit, reset } = useForm<CategoryFormValues>();
  const { mutate, isPending } = useInsertCategory();
  const router = useRouter();

  const onSubmit = (values: CategoryFormValues) => {
    mutate(values, {
      onSuccess: () => {
        reset();
        // Redirect to list page after successful insert programmatically
        router.push('/supabase');
      },
    });
  };

  return (
    <div className='max-w-lg mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow'>
      <div className='flex justify-between items-center mb-4'>
        {/* Back button using Link */}
        <Button
          component={Link}
          href='/supabase'
          variant='outline'
          color='blue'
        >
          Back
        </Button>
        <h2 className='text-2xl font-bold'>Insert Category</h2>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4'
      >
        <TextInput
          label='Category Name'
          placeholder='Enter category name'
          {...register('name', { required: true })}
          required
          variant='filled'
          className='w-full'
        />
        <Button
          type='submit'
          loading={isPending}
          color='blue'
          className='w-full'
        >
          Insert Category
        </Button>
      </form>
    </div>
  );
}

export default InsertCategoryClient;
