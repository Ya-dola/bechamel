'use client';

import React, { useEffect } from 'react';
import CustomAppShell from '@/components/customAppShell/customAppShell';
import CustomMultiSelect from '@/components/customMultiSelect/customMultiSelect';
import RecipeCard from '@/components/recipeCard/recipeCard';
import { useFetchAll } from '@/hooks/useFetchAll';
import { RecipeRecord } from '@/services/supabase_service';
import AuthenticatedPage from '@/components/authenticated_page/authenticated_page';
import { getDifficultyText } from '@/enums/difficultyEnum';

function RecipeListClient() {
  // Fetch categories from the 'categories' table
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: errorCategories,
    refetch: refetchCategories,
  } = useFetchAll({
    table: 'categories',
    page: 1,
    pageSize: 100,
    usePagination: false,
  });

  // Fetch recipe_categories from the join table
  const {
    data: recipeCategoriesData,
    isLoading: isLoadingRC,
    error: errorRC,
    refetch: refetchRC,
  } = useFetchAll({
    table: 'recipe_categories',
    page: 1,
    pageSize: 1000,
    usePagination: false,
  });

  // Fetch recipes from the 'recipes' table
  const {
    data: recipesData,
    isLoading: isLoadingRecipes,
    error: errorRecipes,
    refetch: refetchRecipes,
  } = useFetchAll({
    table: 'recipes',
    page: 1,
    pageSize: 10,
    usePagination: false,
  });

  // State for selected category names (from CustomMultiSelect)
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    [],
  );

  // Build mapping from category name to category id
  const categoryMapping: { [key: string]: number } = {};
  if (categoriesData?.data && Array.isArray(categoriesData.data)) {
    categoriesData.data.forEach((cat: { id: number; name: string }) => {
      categoryMapping[cat.name] = cat.id;
    });
  }

  // Convert selected category names to IDs
  const selectedCategoryIds = selectedCategories
    .map((name) => categoryMapping[name])
    .filter((id): id is number => id !== undefined);

  // Extract all recipe_categories rows
  const recipeCategories = recipeCategoriesData?.data ?? [];

  // If any categories are selected, filter recipe_ids from recipe_categories
  const filteredRecipeIds = new Set<string>();
  if (selectedCategoryIds.length > 0) {
    recipeCategories.forEach(
      (rc: { recipe_id: string; category_id: number }) => {
        if (selectedCategoryIds.includes(rc.category_id)) {
          filteredRecipeIds.add(rc.recipe_id);
        }
      },
    );
  }

  // Extract recipes from fetched data and cast them to RecipeRecord[]
  const recipes: RecipeRecord[] = recipesData?.data ?? [];

  // Filter recipes based on selected categories if any are selected
  const filteredRecipes =
    selectedCategoryIds.length > 0
      ? recipes.filter((r: RecipeRecord) => filteredRecipeIds.has(r.id))
      : recipes;

  // Refetch data when component mounts or table selection changes
  useEffect(() => {
    refetchRecipes();
    refetchCategories();
    refetchRC();
  }, [refetchRecipes, refetchCategories, refetchRC]);

  return (
    <AuthenticatedPage>
      <CustomAppShell padding={0}>
        <div className='flex flex-col px-40 justify-center w-full'>
          <div className='flex flex-row justify-between py-16'>
            <h2 className='text-xl text-left font-semibold'>My Recipes</h2>
            <CustomMultiSelect
              items={
                categoriesData?.data && Array.isArray(categoriesData.data)
                  ? categoriesData.data.map((cat: { name: string }) => cat.name)
                  : []
              }
              onChange={(selected: string[]) => setSelectedCategories(selected)}
            />
          </div>
          {(isLoadingRecipes || isLoadingCategories || isLoadingRC) && (
            <p className='text-gray-400'>Loading recipes...</p>
          )}
          {(errorRecipes || errorCategories || errorRC) && (
            <p className='text-red-500'>
              {errorRecipes?.message ||
                errorCategories?.message ||
                errorRC?.message}
            </p>
          )}
          <div className='flex flex-wrap  gap-8'>
            {filteredRecipes.length > 0
              ? filteredRecipes.map((recipe: RecipeRecord) => (
                  <RecipeCard
                    key={recipe.id}
                    heading={recipe.name}
                    username={recipe.user_id}
                    totalTime={recipe.total_time ?? recipe.prep_time}
                    difficulty={getDifficultyText(recipe.difficulty ?? 0)}
                    height={'max-content'}
                    width={325}
                    imageSrc={
                      typeof recipe.images === 'string'
                        ? recipe.images
                        : Array.isArray(recipe.images) &&
                          recipe.images.length > 0 &&
                          typeof recipe.images[0] === 'object' &&
                          recipe.images[0] !== null &&
                          'image' in recipe.images[0]
                        ? (recipe.images[0] as { image: string }).image
                        : 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png'
                    }
                    href={`/recipe_page?id=${recipe.id}`}
                  />
                ))
              : !isLoadingRecipes && (
                  <p className='text-gray-400'>No recipes available.</p>
                )}
          </div>
        </div>
      </CustomAppShell>
    </AuthenticatedPage>
  );
}

export default RecipeListClient;
