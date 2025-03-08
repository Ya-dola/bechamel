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
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFetchAll } from '@/hooks/useFetchAll';
import {
  uploadImages,
  insertRecipeCategories,
  fetch,
  fetchAll,
  RecipeRecord,
  deleteRecipeCategories,
} from '@/services/supabase_service';
import { Json } from '@/models/json';
import AuthenticatedPage from '@/components/authenticated_page/authenticated_page';
import { useUpdateRecipe } from '@/hooks/useUpdateRecipe';

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

function UpdateRecipeClient() {
  const searchParams = useSearchParams();
  const recipeId = searchParams.get('id') || '';
  const router = useRouter();

  const { register, handleSubmit, control, reset, setValue } =
    useForm<RecipeFormValues>({
      defaultValues: {
        user_id: '', // Set this dynamically from your user auth context/store.
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

  const [initialCategories, setInitialCategories] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

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

  // Fetch categories using useFetchAll (table: 'categories') with pagination disabled.
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

  const { mutateAsync, isPending } = useUpdateRecipe();
  const [difficulty, setDifficulty] = useState<number>(0);

  // Handle Difficulty Change
  const handleDifficultyChange = (value: number) => {
    setDifficulty(value);
    setValue('difficulty', value);
  };

  // Fetch the recipe details to pre-fill the form
  useEffect(() => {
    if (recipeId) {
      fetch<RecipeFormValues>('recipes', recipeId)
        .then(async (recipeData) => {
          // Fetch associated categories
          const catResult = await fetchAll({
            table: 'recipe_categories',
            filters: [{ column: 'recipe_id', value: recipeId, operator: 'eq' }],
            usePagination: false,
          });
          const recipeCategories = catResult.data.map((row) => row.category_id);

          // Check if ingredients data is in correct structure
          const ingredients =
            typeof recipeData.ingredients === 'string'
              ? JSON.parse(recipeData.ingredients)
              : recipeData.ingredients || [];
          const directions =
            typeof recipeData.directions === 'string'
              ? JSON.parse(recipeData.directions)
              : recipeData.directions || [];

          // Prepare complete data from the fetched recipe
          const completeData: RecipeFormValues = {
            user_id: recipeData.user_id,
            name: recipeData.name,
            difficulty: recipeData.difficulty,
            prep_time: recipeData.prep_time,
            cook_time: recipeData.cook_time || 0,
            servings: recipeData.servings || 0,
            shared: recipeData.shared || false,
            ingredients: ingredients,
            directions: directions,
            notes: recipeData.notes || null,
            images: null,
            videos: null,
            categories: recipeCategories,
          };

          // Use reset to fill in the form
          reset(completeData);
          setInitialCategories(completeData.categories);
          setDifficulty(completeData.difficulty); // Set difficulty from fetched recipe data
          setValue('difficulty', completeData.difficulty); // Ensure it reflects in the form state
        })
        .catch((error) => {
          setIsError(true);
          console.log('Error fetching recipe:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [recipeId, reset, setValue]);

  const onSubmit = async (values: RecipeFormValues) => {
    let imageUrls: string[] | null = null;
    if (values.images && values.images.length > 0) {
      const filesArray = Array.from(values.images);
      try {
        imageUrls = await uploadImages(filesArray);
      } catch (error) {
        alert('Image upload failed');
        console.error(error);
        return;
      }
    }

    const { categories, ...recipeData } = values;
    const computedTotalTime = values.prep_time + (values.cook_time ?? 0);

    const recipePayload = {
      recipeId: recipeId,
      data: {
        total_time: computedTotalTime,
        ingredients: values.ingredients as unknown as Json,
        directions: values.directions as unknown as Json,
        notes: values.notes as unknown as Json,
        images: imageUrls,
        user_id: recipeData.user_id,
        name: recipeData.name,
        difficulty: recipeData.difficulty,
        prep_time: recipeData.prep_time,
        cook_time: recipeData.cook_time,
        servings: recipeData.servings,
        shared: recipeData.shared,
        videos: recipeData.videos,
      } as RecipeRecord,
    };

    try {
      const updatedData = await mutateAsync(recipePayload);
      const updatedRecipe = Array.isArray(updatedData)
        ? updatedData[0]
        : updatedData;

      const newCategories = categories;
      const categoriesToAdd = newCategories.filter(
        (cat) => !initialCategories.includes(cat),
      );
      const categoriesToRemove = initialCategories.filter(
        (cat) => !newCategories.includes(cat),
      );

      if (updatedRecipe?.id) {
        if (categoriesToRemove.length > 0) {
          await deleteRecipeCategories(updatedRecipe.id, categoriesToRemove);
        }
        if (categoriesToAdd.length > 0) {
          await insertRecipeCategories(updatedRecipe.id, categoriesToAdd);
        }
      }
      reset();
      router.push(`/recipe_page?id=${updatedRecipe?.id}`);
    } catch (error) {
      console.error('Error updating recipe or categories:', error);
      alert('Failed to update recipe');
    }
  };

  if (isLoading) {
    return (
      <AuthenticatedPage>
        <div className='flex items-center justify-center min-h-screen'>
          <p className='text-gray-400'>Loading...</p>
        </div>
      </AuthenticatedPage>
    );
  }

  if (isError) {
    return (
      <AuthenticatedPage>
        <div className='flex items-center justify-center min-h-screen'>
          <p className='text-gray-400'>Recipe not found.</p>
        </div>
      </AuthenticatedPage>
    );
  }
  return (
    <AuthenticatedPage>
      <div className='max-w-3xl mx-auto mt-10 p-6 bg-white text-gray-700 rounded shadow'>
        <div className='flex justify-between items-center mb-6'>
          <Link
            href='/home_page'
            className='border border-violet-300 bg-white text-gray-800
             hover:bg-violet-300 hover:text-gray-800
              transition-colors rounded-xl
              flex items-center justify-center px-4 h-10'
          >
            Back
          </Link>
          <h2 className='text-2xl font-bold text-center flex-1'>
            Update Recipe
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
              {[0, 1, 2].map((level) => (
                <button
                  key={level}
                  type='button'
                  className={`flex-1 py-2 rounded-md text-black ${
                    difficulty === level
                      ? 'bg-violet-300'
                      : 'border bg-slate-200 hover:bg-slate-300'
                  }`}
                  onClick={() => handleDifficultyChange(level)}
                >
                  {['Easy', 'Medium', 'Hard'][level]}
                </button>
              ))}
            </div>
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
          {/* Label and File input for images */}
          <div className='flex flex-col'>
            <label className='mb-1 font-medium'>Recipe Images</label>
            <Controller
              control={control}
              name='images'
              render={({ field: { onChange, ref } }) => (
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={(e) => onChange(e.target.files)}
                  ref={ref}
                  title='Upload Images'
                  className='block w-full text-sm text-gray-500
                             file:mr-4 file:py-2 file:px-4
                             file:rounded file:border-0
                             file:text-sm file:font-semibold
                             file:bg-violet-200 file:text-gray-800
                             hover:file:bg-violet-100'
                />
              )}
            />
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
            className={`rounded-xl transition-colors flex items-center
                justify-center text-sm h-10 w-full
                px-4 bg-violet-300 text-black
                ${
                  isPending
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-white hover:border hover:border-violet-400'
                }`}
            disabled={isPending} // Disable button when loading
          >
            {isPending ? 'Updating...' : 'Update Recipe'}
          </button>
        </form>
      </div>
    </AuthenticatedPage>
  );
}

export default UpdateRecipeClient;
