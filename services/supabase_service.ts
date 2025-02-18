import { Filter } from '@/models/filter';
import { Json } from '@/models/json';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

interface FetchAllParams {
  table: string;
  filters?: Filter[];
  page?: number;
  pageSize?: number;
  usePagination?: boolean;
}

export async function fetchAll({
  table,
  filters = [],
  page = 1,
  pageSize = 10,
  usePagination = true,
}: FetchAllParams) {
  let query = supabase.from(table).select('*', { count: 'exact' });

  // Apply filters dynamically using switch-case
  filters.forEach(({ column, value, operator = 'eq' }) => {
    switch (operator) {
      case 'eq':
        query = query.eq(column, value);
        break;
      case 'not':
        query = query.not(column, 'is', value);
        break;
      case 'lt':
        query = query.lt(column, value);
        break;
      case 'lte':
        query = query.lte(column, value);
        break;
      case 'gt':
        query = query.gt(column, value);
        break;
      case 'gte':
        query = query.gte(column, value);
        break;
      case 'like':
        query = query.like(column, value as string);
        break;
      case 'ilike':
        query = query.ilike(column, value as string);
        break;
      case 'is':
        query = query.is(column, value);
        break;
      case 'in':
        // Make sure value is an array when using the "in" operator.
        query = query.in(column, value as (string | number | boolean)[]);
        break;
      default:
        throw new Error(`Unsupported filter operator: ${operator}`);
    }
  });

  // Apply pagination only if enabled
  if (usePagination) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }

  // Debugging: Check if query is valid before executing
  // console.log('Executing Query:', query);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return { data, count };
}

/**
 * Fetch a single record from the specified table with optional filters.
 * @param table - The table name.
 * @param id - The record id.
 * @param filters - Additional filters to apply.
 * @returns The single record as type T.
 */
export async function fetch<T>(
  table: string,
  id: string | number,
  filters: Filter[] = [],
): Promise<T> {
  let query = supabase.from(table).select('*').eq('id', id);

  filters.forEach(({ column, value, operator = 'eq' }) => {
    switch (operator) {
      case 'eq':
        query = query.eq(column, value);
        break;
      case 'not':
        query = query.not(column, 'is', value);
        break;
      case 'lt':
        query = query.lt(column, value);
        break;
      case 'lte':
        query = query.lte(column, value);
        break;
      case 'gt':
        query = query.gt(column, value);
        break;
      case 'gte':
        query = query.gte(column, value);
        break;
      case 'like':
        query = query.like(column, value as string);
        break;
      case 'ilike':
        query = query.ilike(column, value as string);
        break;
      case 'is':
        query = query.is(column, value);
        break;
      case 'in':
        // Make sure value is an array when using the "in" operator.
        query = query.in(column, value as (string | number | boolean)[]);
        break;
      default:
        throw new Error(`Unsupported filter operator: ${operator}`);
    }
  });

  // Debugging: Check if query is valid before executing
  // console.log('Executing Query:', query);

  const { data, error } = await query.single();
  if (error) throw error;
  return data as T;
}

export interface DeleteParams {
  table: string;
  ids: (string | number)[];
}

/**
 * Soft delete records by updating the `deleted_at` column.
 */
export async function softDeleteRecords({ table, ids }: DeleteParams) {
  const nowUtc = new Date().toISOString();
  const { data, error } = await supabase
    .from(table)
    .update({ deleted_at: nowUtc })
    .in('id', ids)
    .select();
  if (error) throw error;
  return data;
}

/**
 * Hard delete records by removing them from the table.
 */
export async function hardDeleteRecords({ table, ids }: DeleteParams) {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .in('id', ids)
    .select();
  if (error) throw error;
  return data;
}
/**
 * Insert a new category.
 */
export async function insertCategory(category: { name: string }) {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select();
  if (error) throw error;
  return data;
}

/**
 * RecipeRecord represents a row from the recipes table.
 */
export interface RecipeRecord {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  ingredients: Json;
  directions?: Json;
  prep_time: number;
  cook_time?: number;
  total_time?: number;
  servings?: number;
  shared?: boolean;
  images?: Json;
  videos?: Json;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

/**
 * RecipeInput represents the data needed to insert a recipe.
 */
export interface RecipeInput {
  user_id: string;
  name: string;
  description?: string;
  ingredients: Json;
  directions?: Json;
  prep_time: number;
  cook_time?: number;
  total_time?: number;
  servings?: number;
  shared?: boolean;
  images?: Json;
  videos?: Json;
}

/**
 * Insert a new recipe.
 * Make sure your Supabase function returns a valid record.
 */ export async function insertRecipe(
  recipe: RecipeInput,
): Promise<RecipeRecord[]> {
  const { data, error } = await supabase
    .from('recipes')
    .insert(recipe)
    .select(); // Add .select() to return the inserted records
  if (error) throw error;
  return data as RecipeRecord[];
}

/**
 * Insert rows into the recipe_categories join table.
 */
export async function insertRecipeCategories(
  recipe_id: string,
  category_ids: number[],
) {
  const rows = category_ids.map((category_id) => ({ recipe_id, category_id }));
  const { data, error } = await supabase
    .from('recipe_categories')
    .insert(rows)
    .select();
  if (error) throw error;
  return data;
}

/**
 * Delete join records for the given recipe and category IDs.
 */
export async function deleteRecipeCategories(
  recipe_id: string,
  category_ids: number[],
) {
  const { data, error } = await supabase
    .from('recipe_categories')
    .delete()
    .eq('recipe_id', recipe_id)
    .in('category_id', category_ids);
  if (error) throw error;
  return data;
}

/**
 * Dummy uploadImages function.
 */
export async function uploadImages(files: File[]): Promise<string[]> {
  // In production, upload files to your storage bucket.
  // Here we simulate an upload delay and return dummy URLs.
  await new Promise((resolve) => setTimeout(resolve, 500));
  return files.map(
    (file) => `https://example.com/uploads/${encodeURIComponent(file.name)}`,
  );
}

/**
 * Update an existing recipe.
 * It takes the recipe id and the fields to update.
 */
export async function updateRecipe(
  recipeId: string,
  recipe: RecipeInput,
): Promise<RecipeRecord[]> {
  const { data, error } = await supabase
    .from('recipes')
    .update(recipe)
    .eq('id', recipeId)
    .select();
  if (error) throw error;
  return data as RecipeRecord[];
}
