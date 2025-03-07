'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import CustomAppShell from '@/components/customAppShell/customAppShell';
import CustomBadge from '@/components/customBadge/customBadge';
import IngredientCard from '@/components/ingredientCard/ingredientCard';
import NotesCard from '@/components/notesCard/notesCard';
import CustomImage from '@/components/customImage/customImage';
import IconCard from '@/components/iconCard/iconCard';
import { fetch, fetchAll } from '@/services/supabase_service';
import { RecipeRecord } from '@/services/supabase_service';
import DirectionsCard from '@/components/directionsCard/directionsCard';
import AuthenticatedPage from '@/components/authenticated_page/authenticated_page';
import Link from 'next/link';

function RecipePageClient() {
  const searchParams = useSearchParams();
  const recipeId = searchParams.get('id') || '';
  const [recipe, setRecipe] = useState<RecipeRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recipeCategories, setRecipeCategories] = useState<string[]>([]);
  const [catLoading, setCatLoading] = useState<boolean>(true);

  useEffect(() => {
    if (recipeId) {
      // Fetch the recipe data
      fetch<RecipeRecord>('recipes', recipeId)
        .then((data) => {
          setRecipe(data);
          // After recipe is fetched, fetch its categories
          fetchAll({
            table: 'recipe_categories',
            filters: [{ column: 'recipe_id', value: recipeId, operator: 'eq' }],
            usePagination: false,
          })
            .then((rcResult) => {
              type RecipeCategory = { recipe_id: string; category_id: number };
              const categoryIds = (rcResult.data as RecipeCategory[]).map(
                (rc) => rc.category_id,
              );
              if (categoryIds.length > 0) {
                // Fetch the actual category names
                fetchAll({
                  table: 'categories',
                  filters: [
                    { column: 'id', value: categoryIds, operator: 'in' },
                  ],
                  usePagination: false,
                })
                  .then((catResult) => {
                    type Category = { id: number; name: string };
                    const names = (catResult.data as Category[]).map(
                      (cat) => cat.name,
                    );
                    setRecipeCategories(names);
                    setCatLoading(false);
                  })
                  .catch((err) => {
                    console.error('Error fetching categories:', err);
                    setCatLoading(false);
                  });
              } else {
                setRecipeCategories([]);
                setCatLoading(false);
              }
            })
            .catch((err) => {
              console.error('Error fetching recipe categories:', err);
              setCatLoading(false);
            });
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching recipe:', error);
          setIsLoading(false);
        });
    }
  }, [recipeId]);

  // TODO - Change to Loader
  if (isLoading) {
    return (
      <CustomAppShell padding={0}>
        <div className='flex items-center justify-center min-h-screen'>
          <p className='text-gray-400'>Loading...</p>
        </div>
      </CustomAppShell>
    );
  }

  if (!recipe) {
    return (
      <CustomAppShell padding={0}>
        <div className='flex items-center justify-center min-h-screen'>
          <p className='text-gray-400'>Recipe not found.</p>
        </div>
      </CustomAppShell>
    );
  }

  // Process image source
  const imageSrc =
    typeof recipe.images === 'string'
      ? recipe.images
      : Array.isArray(recipe.images) &&
        recipe.images.length > 0 &&
        typeof recipe.images[0] === 'object' &&
        recipe.images[0] !== null &&
        'image' in recipe.images[0]
      ? (recipe.images[0] as { image: string }).image
      : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png';

  // Ensure ingredients, directions, and notes are parsed
  const ingredients =
    typeof recipe.ingredients === 'string'
      ? JSON.parse(recipe.ingredients)
      : recipe.ingredients;
  const directions =
    typeof recipe.directions === 'string'
      ? JSON.parse(recipe.directions)
      : recipe.directions;
  const notes =
    typeof recipe.notes === 'string'
      ? JSON.parse(recipe.notes)
      : recipe.notes || [];

  return (
    <AuthenticatedPage>
      <CustomAppShell padding={0}>
        <div className='flex flex-row items-center px-40 py-4 bg-gray-100'>
          <Icon icon={'line-md:arrow-left'} />
          <Link
            href='/recipe_list'
            className={`rounded-full transition-colors flex items-center  text-sm sm:text-base h-10 sm:h-12 px-2 sm:min-w-44 hover:underline`}
          >
            Back
          </Link>
        </div>
        <div className='flex flex-row p-10 px-90 gap-30 justify-between bg-gray-100'>
          <div className='flex flex-col gap-8 justify-between'>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-row justify-between items-center'>
                <h1 className='w-full text-[40px] leading-[44px] tracking-[-0.03em] font-semibold text-left'>
                  {recipe.name}
                </h1>
                <div className='flex items-center justify-center w-8 h-8 border border-black rounded-full'>
                  <Icon
                    icon='line-md:heart'
                    height={20}
                    width={20}
                  />
                </div>
              </div>
              <div className='flex flex-row gap-1'>
                <div className='w-8 h-8 rounded-full bg-gray-400 mr-2' />
                <h2 className='w-full text-left'>{recipe.user_id}</h2>
              </div>
              <div className='flex flex-row gap-2 w-fit'>
                {!catLoading ? (
                  recipeCategories.length > 0 ? (
                    recipeCategories.map((catName, idx) => (
                      <CustomBadge
                        key={idx}
                        text={catName}
                      />
                    ))
                  ) : null
                ) : (
                  <p className='text-gray-400 text-sm'>Loading categories...</p>
                )}
              </div>
            </div>
            <div className='flex flex-row gap-2'>
              <IconCard
                label='Prep Time'
                subText={`${recipe.prep_time} min`}
                bgColor='bg-red-200'
                labelColor='text-slate-700'
                subTextColor='text-slate-900'
              />
              <IconCard
                label='Cook Time'
                subText={recipe.cook_time ? `${recipe.cook_time} min` : 'N/A'}
                bgColor='bg-green-200'
                labelColor='text-slate-700'
                subTextColor='text-slate-900'
              />
              <IconCard
                label='Servings'
                subText={recipe.servings ? `${recipe.servings}` : 'N/A'}
                bgColor='bg-purple-200'
                labelColor='text-slate-700'
                subTextColor='text-slate-900'
              />
              <IconCard
                label='Difficulty'
                subText={recipe.difficulty ? `${recipe.difficulty}` : 'N/A'}
                bgColor='bg-blue-200'
                labelColor='text-slate-700'
                subTextColor='text-slate-900'
              />
            </div>
          </div>
          <div className='flex items-center'>
            <CustomImage
              width={600}
              radius='md'
              imageSrc={imageSrc}
            />
          </div>
        </div>
        <div className='flex flex-row p-10 px-40 gap-10 justify-center'>
          <div className='flex flex-col gap-8'>
            {ingredients.length > 0 && <IngredientCard items={ingredients} />}
            {notes.length > 0 && <NotesCard items={notes} />}
          </div>
          <div>
            {directions.length > 0 && <DirectionsCard items={directions} />}
          </div>
        </div>
      </CustomAppShell>
    </AuthenticatedPage>
  );
}

export default RecipePageClient;
