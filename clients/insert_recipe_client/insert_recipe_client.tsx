'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  TextInput,
  Textarea,
  NumberInput,
  Switch,
  Button,
  MultiSelect,
} from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useInsertRecipe } from '@/hooks/useInsertRecipe';
import { useFetchAll } from '@/hooks/useFetchAll';
import {
  uploadImage,
  insertRecipeCategories,
} from '@/services/supabase_service';
import { Json } from '@/models/json';
import AuthenticatedPage from '@/components/authenticated_page/authenticated_page';
import ImageCropper from '@/components/imageCropper/imageCropper';
import React from 'react';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface DirectionStep {
  instruction: string;
}

interface Note {
  note: string;
}

interface RecipeFormValues {
  user_id: string;
  name: string;
  difficulty: number;
  prep_time: number;
  cook_time?: number;
  servings?: number;
  shared?: boolean;
  ingredients: Ingredient[];
  directions: DirectionStep[];
  notes?: Note[] | null;
  images: FileList | null;
  videos: null;
  categories: number[]; // Selected category IDs (for join table)
}

function InsertRecipe() {
  // For now, use the test user id; in production, get from your auth store.
  const userId = process.env.NEXT_PUBLIC_TEST_USER_ID ?? '';
  const { register, handleSubmit, control, reset, setValue } =
    useForm<RecipeFormValues>({
      defaultValues: {
        user_id: userId,
        name: '',
        difficulty: 0,
        prep_time: 0,
        cook_time: 0,
        servings: 0,
        shared: false,
        ingredients: [{ name: '', amount: 0, unit: '' }],
        directions: [{ instruction: '' }],
        notes: null,
        images: null,
        videos: null,
        categories: [],
      },
      mode: 'onChange',
    });

  // Field arrays for structured fields
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: 'ingredients',
  });
  const {
    fields: directionFields,
    append: appendDirection,
    remove: removeDirection,
  } = useFieldArray({
    control,
    name: 'directions',
  });
  const {
    fields: noteFields,
    append: appendNote,
    remove: removeNote,
  } = useFieldArray({
    control,
    name: 'notes',
  });

  // Fetch categories using useFetchAll (table: 'categories') with pagination disabled
  const { data: categoriesData, isLoading: categoriesLoading } = useFetchAll({
    table: 'categories',
    usePagination: false,
  });
  const categoryOptions =
    (categoriesData?.data as { id: number; name: string }[] | undefined)?.map(
      (cat) => ({
        value: cat.id.toString(),
        label: cat.name,
      }),
    ) || [];

  // Difficulty state
  const [difficulty, setDifficulty] = useState<number>(0);
  const handleDifficultyChange = (value: number) => {
    setDifficulty(value);
    setValue('difficulty', value);
  };

  const { mutateAsync, isPending } = useInsertRecipe();
  const router = useRouter();

  // Cropping state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);

  // Image upload state
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  const onSubmit = async (values: RecipeFormValues) => {
    let imageUrl: string | null = null;
    if (croppedFile) {
      try {
        setIsUploadingImage(true); // set state true before uploading
        imageUrl = await uploadImage(croppedFile, userId);
        setIsUploadingImage(false);
      } catch (error) {
        setIsUploadingImage(false);
        alert('Image upload failed');
        console.log('Error uploading image', error);
        return;
      }
    }

    // Extract categories from form values.
    const { categories, ...recipeData } = values;
    const computedTotalTime = values.prep_time + (values.cook_time ?? 0);
    const recipePayload = {
      ...recipeData,
      total_time: computedTotalTime,
      ingredients: values.ingredients as unknown as Json,
      directions: values.directions as unknown as Json,
      notes: values.notes as unknown as Json,
      images: imageUrl,
    };

    try {
      const recipeDataResponse = await mutateAsync(recipePayload);
      const newRecipe = Array.isArray(recipeDataResponse)
        ? recipeDataResponse[0]
        : recipeDataResponse;
      if (categories.length > 0 && newRecipe?.id) {
        await insertRecipeCategories(newRecipe.id, categories);
      }
      reset();
      router.push(`/recipe_page?id=${newRecipe?.id}`);
    } catch (error) {
      console.log('Error inserting recipe or categories:', error);
      alert('Failed to insert recipe');
    }
  };

  return (
    <AuthenticatedPage>
      {showCropper && selectedFile && (
        <ImageCropper
          imageFile={selectedFile}
          onCropComplete={(cropped) => {
            setCroppedFile(cropped);
            setShowCropper(false);
          }}
          onCancel={() => {
            setSelectedFile(null);
            setCroppedFile(null);
            setShowCropper(false);
          }}
        />
      )}
      <div className='max-w-3xl mx-auto mt-10 p-6 bg-white text-gray-700 rounded shadow'>
        <div className='flex justify-between items-center mb-6'>
          <Link
            href='/home_page'
            className='border border-violet-300 bg-white text-gray-800 hover:bg-violet-300 hover:text-gray-800 transition-colors rounded-xl flex items-center justify-center px-4 h-10'
          >
            Back
          </Link>
          <h2 className='text-2xl font-bold text-center flex-1'>
            Insert Recipe
          </h2>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4'
        >
          <TextInput
            label='Recipe Name'
            placeholder='Enter recipe name'
            {...register('name', { required: true })}
            required
            variant='filled'
            className='w-full'
          />
          {/* Difficulty Section */}
          <div className='mt-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Difficulty
            </label>
            <div className='flex space-x-4'>
              <button
                type='button'
                className={`flex-1 py-2 rounded-md text-black ${
                  difficulty === 0
                    ? 'bg-violet-300'
                    : 'border bg-slate-200 hover:bg-slate-300'
                }`}
                onClick={() => handleDifficultyChange(0)}
              >
                Easy
              </button>
              <button
                type='button'
                className={`flex-1 py-2 rounded-md text-black ${
                  difficulty === 1
                    ? 'bg-violet-300'
                    : 'border bg-slate-200 hover:bg-slate-300'
                }`}
                onClick={() => handleDifficultyChange(1)}
              >
                Medium
              </button>
              <button
                type='button'
                className={`flex-1 py-2 rounded-md text-black ${
                  difficulty === 2
                    ? 'bg-violet-300'
                    : 'border bg-slate-200 hover:bg-slate-300'
                }`}
                onClick={() => handleDifficultyChange(2)}
              >
                Hard
              </button>
            </div>
            <input
              type='hidden'
              {...register('difficulty')}
              value={difficulty}
            />
          </div>
          <Controller
            control={control}
            name='prep_time'
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <NumberInput
                label='Prep Time (minutes)'
                placeholder='Prep time'
                value={value}
                onChange={onChange}
                required
                variant='filled'
                className='w-full'
              />
            )}
          />
          <Controller
            control={control}
            name='cook_time'
            render={({ field: { value, onChange } }) => (
              <NumberInput
                label='Cook Time (minutes)'
                placeholder='Cook time'
                value={value}
                onChange={onChange}
                variant='filled'
                className='w-full'
              />
            )}
          />
          <Controller
            control={control}
            name='servings'
            render={({ field: { value, onChange } }) => (
              <NumberInput
                label='Servings'
                placeholder='Servings'
                value={value}
                onChange={onChange}
                variant='filled'
                className='w-full'
              />
            )}
          />
          <Controller
            control={control}
            name='shared'
            render={({ field }) => (
              <Switch
                label='Shared'
                checked={field.value}
                onChange={(event) =>
                  field.onChange(event.currentTarget.checked)
                }
                color={'#DBCDF0'}
              />
            )}
          />
          {/* MultiSelect for Categories */}
          <Controller
            control={control}
            name='categories'
            render={({ field }) => (
              <MultiSelect
                label='Categories'
                placeholder={
                  categoriesLoading
                    ? 'Loading categories...'
                    : 'Select categories'
                }
                data={categoryOptions}
                value={field.value.map(String)}
                onChange={(values) => field.onChange(values.map(Number))}
                searchable
                nothingFoundMessage='No categories found'
                className='w-full'
                disabled={categoriesLoading}
              />
            )}
          />
          {/* File input for images */}
          <div className='flex flex-col'>
            <label className='mb-1 font-medium'>Recipe Images</label>
            {/* File info display */}
            <div className='flex flex-row gap-2 justify-center'>
              <div
                className='w-full border rounded px-4 py-2 cursor-pointer'
                onClick={() => {
                  // Trigger the hidden file input click.
                  document.getElementById('fileInput')?.click();
                }}
              >
                <span className='text-sm text-gray-500'>
                  {selectedFile
                    ? `${selectedFile.name} - ${
                        croppedFile
                          ? (croppedFile.size / (1024 * 1024)).toFixed(2) +
                            ' MB'
                          : 'Processing...'
                      }`
                    : 'No image chosen'}
                </span>
              </div>
              {/* Buttons container */}
              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={() => {
                    setSelectedFile(null);
                    setCroppedFile(null);
                    // Also, clear the file field value for react-hook-form:
                    reset({ images: null });
                  }}
                  className='cursor-pointer w-max rounded-xl transition-colors flex items-center justify-center text-sm h-10 px-4 bg-white border border-violet-300 text-black hover:bg-violet-100 hover:text-black'
                >
                  Clear
                </button>
                <button
                  type='button'
                  onClick={() => {
                    // Trigger the hidden file input click.
                    document.getElementById('fileInput')?.click();
                  }}
                  className='cursor-pointer w-max rounded-xl transition-colors flex items-center justify-center text-sm h-10 px-4 bg-violet-300 text-black hover:bg-white hover:border hover:border-violet-400'
                >
                  Select Image
                </button>
              </div>
              {/* Hidden file input integrated with react-hook-form */}
              <Controller
                control={control}
                name='images'
                render={({ field: { onChange, ref } }) => (
                  <input
                    id='fileInput'
                    type='file'
                    accept='image/png, image/jpeg, image/jpg, image/webp'
                    title='Select an image file'
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        setShowCropper(true);
                      }
                      onChange(e.target.files);
                      // Clear native input value so that selecting the same file again will trigger onChange.
                      e.target.value = '';
                    }}
                    ref={ref}
                    className='hidden'
                  />
                )}
              />
            </div>
          </div>
          {/* Structured Ingredients */}
          <div className='border p-4 rounded'>
            <h3 className='font-bold mb-2'>Ingredients</h3>
            {ingredientFields.map((field, index) => (
              <div
                key={field.id}
                className='flex gap-2 mb-2'
              >
                <TextInput
                  placeholder='Name'
                  {...register(`ingredients.${index}.name` as const, {
                    required: true,
                  })}
                  className='flex-1'
                />
                <Controller
                  control={control}
                  name={`ingredients.${index}.amount` as const}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <NumberInput
                      placeholder='Amount'
                      value={value}
                      onChange={onChange}
                      className='w-24'
                    />
                  )}
                />
                <TextInput
                  placeholder='Unit'
                  {...register(`ingredients.${index}.unit` as const, {
                    required: true,
                  })}
                  className='w-24'
                />
                <Button
                  color='red'
                  onClick={() => removeIngredient(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <button
              type='button'
              className='bg-slate-200 text-black rounded-md hover:bg-slate-100 transition-all flex items-center justify-center px-4 h-10'
              onClick={() =>
                appendIngredient({ name: '', amount: 0, unit: '' })
              }
            >
              Add Ingredient
            </button>
          </div>
          {/* Structured Directions */}
          <div className='border p-4 rounded'>
            <h3 className='font-bold mb-2'>Directions</h3>
            {directionFields.map((field, index) => (
              <div
                key={field.id}
                className='flex gap-2 mb-2'
              >
                <Textarea
                  placeholder={`Step ${index + 1}`}
                  {...register(`directions.${index}.instruction` as const, {
                    required: true,
                  })}
                  className='flex-1'
                />
                <Button
                  color='red'
                  onClick={() => removeDirection(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <button
              type='button'
              className='bg-slate-200 text-black rounded-md hover:bg-slate-100 transition-all flex items-center justify-center px-4 h-10'
              onClick={() => appendDirection({ instruction: '' })}
            >
              Add Direction
            </button>
          </div>
          {/* Structured Notes */}
          <div className='border p-4 rounded'>
            <h3 className='font-bold mb-2'>Notes</h3>
            {noteFields.map((field, index) => (
              <div
                key={field.id}
                className='flex gap-2 mb-2'
              >
                <Textarea
                  placeholder={`Note ${index + 1}`}
                  {...register(`notes.${index}.note` as const, {
                    required: true,
                  })}
                  className='flex-1'
                />
                <Button
                  color='red'
                  onClick={() => removeNote(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <button
              type='button'
              className='bg-slate-200 text-black rounded-md hover:bg-slate-100 transition-all flex items-center justify-center px-4 h-10'
              onClick={() => appendNote({ note: '' })}
            >
              Add Note
            </button>
          </div>
          <button
            type='submit'
            className={`cursor-pointer rounded-xl transition-colors flex items-center 
              justify-center text-sm h-10 w-full px-4 bg-violet-300 text-black ${
                isPending || isUploadingImage
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-white hover:border hover:border-violet-400'
              }`}
            disabled={isPending || isUploadingImage}
          >
            {isPending
              ? 'Adding Recipe...'
              : isUploadingImage
              ? 'Uploading Image...'
              : 'Insert Recipe'}
          </button>
        </form>
      </div>
    </AuthenticatedPage>
  );
}

export default InsertRecipe;
