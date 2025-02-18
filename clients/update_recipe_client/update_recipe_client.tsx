'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  TextInput,
  Textarea,
  NumberInput,
  Switch,
  Button,
  MultiSelect,
  Loader,
} from '@mantine/core';
import Link from 'next/link';
import { useUpdateRecipe } from '@/hooks/useUpdateRecipe';
import { useFetchAll } from '@/hooks/useFetchAll';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  uploadImages,
  insertRecipeCategories,
  deleteRecipeCategories,
  fetch,
  fetchAll,
} from '@/services/supabase_service';
import { Json } from '@/models/json';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface DirectionStep {
  instruction: string;
}

export interface RecipeFormValues {
  user_id: string;
  name: string;
  description?: string;
  prep_time: number;
  cook_time?: number;
  servings?: number;
  shared?: boolean;
  ingredients: Ingredient[];
  directions: DirectionStep[];
  images: FileList | null;
  videos: null;
  categories: number[]; // Selected category IDs from join table.
}

function UpdateRecipeClient() {
  const searchParams = useSearchParams();
  const recipeId = searchParams.get('id') || '';
  const router = useRouter();

  const { register, handleSubmit, control, reset } = useForm<RecipeFormValues>({
    defaultValues: {
      // TODO - Add user_id from auth
      user_id: '',
      name: '',
      description: '',
      prep_time: 0,
      cook_time: 0,
      servings: 0,
      shared: false,
      ingredients: [{ name: '', amount: 0, unit: '' }],
      directions: [{ instruction: '' }],
      images: null,
      videos: null,
      categories: [],
    },
  });
  const [initialCategories, setInitialCategories] = useState<number[]>([]);
  const [isRecipeLoading, setIsRecipeLoading] = useState<boolean>(true);

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: 'ingredients' });
  const {
    fields: directionFields,
    append: appendDirection,
    remove: removeDirection,
  } = useFieldArray({ control, name: 'directions' });

  // Fetch all categories for MultiSelect
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

  // Fetch the recipe record using fetch,
  // then use fetchAll on 'recipe_categories' to get its associated categories.
  useEffect(() => {
    if (recipeId) {
      fetch<RecipeFormValues>('recipes', recipeId)
        .then(async (recipeData) => {
          // Use fetchAll with a filter on recipe_categories to get associated category IDs.
          const catResult = await fetchAll({
            table: 'recipe_categories',
            filters: [{ column: 'recipe_id', value: recipeId, operator: 'eq' }],
            usePagination: false,
          });
          const recipeCategories = catResult.data.map((row) => row.category_id);
          const completeData = {
            ...recipeData,
            categories: recipeCategories || [],
          };
          reset(completeData);
          setInitialCategories(completeData.categories);
          setIsRecipeLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching recipe:', error);
          alert('Failed to load recipe for editing');
          setIsRecipeLoading(false);
        });
    }
  }, [recipeId, reset]);

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

    // Exclude categories from the update payload.
    const { categories, ...recipeData } = values;
    const computedTotalTime = values.prep_time + (values.cook_time ?? 0);

    const updatePayload = {
      ...recipeData,
      total_time: computedTotalTime,
      ingredients: values.ingredients as unknown as Json,
      directions: values.directions as unknown as Json,
      images: imageUrls,
    };

    try {
      const updatedData = await mutateAsync({ recipeId, data: updatePayload });
      const updatedRecipe = Array.isArray(updatedData)
        ? updatedData[0]
        : updatedData;

      // Differential update for join records:
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
      router.push('/supabase');
    } catch (error) {
      console.error('Error updating recipe or categories:', error);
      alert('Failed to update recipe');
    }
  };

  if (isRecipeLoading) {
    return (
      <div className='max-w-3xl min-h-96 mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow flex items-center justify-center'>
        <Loader
          color='blue'
          size='lg'
        />
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow'>
      <div className='flex justify-between items-center mb-6'>
        <Button
          component={Link}
          href='/supabase'
          variant='outline'
          color='blue'
        >
          Back
        </Button>
        <h2 className='text-2xl font-bold text-center flex-1'>Update Recipe</h2>
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
        <Textarea
          label='Description'
          placeholder='Enter recipe description'
          {...register('description')}
          variant='filled'
          className='w-full'
        />
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
              onChange={(event) => field.onChange(event.currentTarget.checked)}
              color='blue'
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
                           file:bg-blue-50 file:text-blue-700
                           hover:file:bg-blue-100'
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
          <Button
            color='blue'
            onClick={() => appendIngredient({ name: '', amount: 0, unit: '' })}
          >
            Add Ingredient
          </Button>
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
          <Button
            color='blue'
            onClick={() => appendDirection({ instruction: '' })}
          >
            Add Direction
          </Button>
        </div>

        <Button
          type='submit'
          loading={isPending}
          color='blue'
          className='w-full'
        >
          Update Recipe
        </Button>
      </form>
    </div>
  );
}

export default UpdateRecipeClient;
