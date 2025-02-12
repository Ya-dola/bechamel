import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

interface FetchAllParams {
  table: string;
  filters?: {
    column: string;
    value: string | number | boolean | null;
    operator?:
      | 'eq'
      | 'not'
      | 'lt'
      | 'lte'
      | 'gt'
      | 'gte'
      | 'like'
      | 'ilike'
      | 'is';
  }[];
  page?: number;
  pageSize?: number;
  usePagination?: boolean;
}

export const fetchAll = async ({
  table,
  filters = [],
  page = 1,
  pageSize = 10,
  usePagination = true,
}: FetchAllParams) => {
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
  console.log('Executing Query:', query);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return { data, count };
};
