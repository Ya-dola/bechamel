'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Loader,
} from '@mantine/core';
import Link from 'next/link';
import { fetch, fetchAll } from '@/services/supabase_service';
import { Category } from '@/models/category';

export interface RecipeView {
  user_id: string;
  name: string;
  description?: string;
  prep_time: number;
  cook_time?: number;
  servings?: number;
  shared?: boolean;
  ingredients: { name: string; amount: number; unit: string }[];
  directions: { instruction: string }[];
  images: string[] | null;
  videos: string[] | null;
  total_time: number;
  // Recipe record does not include categories directly.
}

function ViewRecipeClient() {
  const searchParams = useSearchParams();
  const recipeId = searchParams.get('id') || '';
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeView | null>(null);
  // Store category names as an array of strings.
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (recipeId) {
      // Fetch the recipe record using the generic fetch function.
      fetch<RecipeView>('recipes', recipeId)
        .then(async (data) => {
          // Compute total_time if needed.
          const completeRecipe: RecipeView = {
            ...data,
            total_time: data.prep_time + (data.cook_time || 0),
          };
          setRecipe(completeRecipe);

          // Fetch join records for this recipe from recipe_categories.
          const catResult = await fetchAll({
            table: 'recipe_categories',
            filters: [{ column: 'recipe_id', value: recipeId, operator: 'eq' }],
            usePagination: false,
          });
          const recipeCategoryIds = catResult.data.map(
            (row) => row.category_id,
          );

          if (recipeCategoryIds.length > 0) {
            // Use fetchAll with an 'in' filter to get only the categories for these IDs.
            const catNamesResult = await fetchAll({
              table: 'categories',
              filters: [
                { column: 'id', value: recipeCategoryIds, operator: 'in' },
              ],
              usePagination: false,
            });
            const names = catNamesResult.data.map((cat: Category) => cat.name);
            setCategoryNames(names);
          } else {
            setCategoryNames([]);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching recipe:', error);
          alert('Failed to load recipe');
          setIsLoading(false);
        });
    }
  }, [recipeId]);

  if (isLoading) {
    return (
      <div className='max-w-3xl min-h-96 mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow flex items-center justify-center'>
        <Loader
          color='blue'
          size='lg'
        />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className='max-w-3xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow flex items-center justify-center'>
        <p>Recipe not found.</p>
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow space-y-4'>
      <div className='flex justify-between items-center mb-6'>
        <Button
          component={Link}
          href='/supabase'
          variant='outline'
          color='blue'
        >
          Back
        </Button>
        <h2 className='text-2xl font-bold'>View Recipe</h2>
      </div>
      <div className='space-y-2'>
        <TextInput
          label='Recipe Name'
          value={recipe.name}
          disabled
          variant='filled'
          className='w-full'
        />
        <Textarea
          label='Description'
          value={recipe.description || ''}
          disabled
          variant='filled'
          className='w-full'
        />
        <NumberInput
          label='Prep Time (minutes)'
          value={recipe.prep_time}
          disabled
          variant='filled'
          className='w-full'
        />
        <NumberInput
          label='Cook Time (minutes)'
          value={recipe.cook_time || 0}
          disabled
          variant='filled'
          className='w-full'
        />
        <NumberInput
          label='Total Time (minutes)'
          value={recipe.total_time}
          disabled
          variant='filled'
          className='w-full'
        />
        <NumberInput
          label='Servings'
          value={recipe.servings || 0}
          disabled
          variant='filled'
          className='w-full'
        />
        <TextInput
          label='Shared'
          value={recipe.shared ? 'Yes' : 'No'}
          disabled
          variant='filled'
          className='w-full'
        />
      </div>
      <div>
        <h3 className='text-xl font-bold'>Ingredients</h3>
        <ul className='list-disc pl-5'>
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx}>
              {ing.name} - {ing.amount} {ing.unit}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className='text-xl font-bold'>Directions</h3>
        <ol className='list-decimal pl-5'>
          {recipe.directions.map((dir, idx) => (
            <li key={idx}>{dir.instruction}</li>
          ))}
        </ol>
      </div>
      <div>
        <h3 className='text-xl font-bold'>Categories</h3>
        {categoryNames.length > 0 ? (
          <ul className='list-disc pl-5'>
            {categoryNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        ) : (
          <p>None</p>
        )}
      </div>
      <Button
        onClick={() => router.push('/supabase')}
        variant='outline'
        color='blue'
      >
        Back to Dashboard
      </Button>
    </div>
  );
}

export default ViewRecipeClient;
