'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAll } from '@/services/supabase_service';

interface UseFetchAllParams {
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

export const useFetchAll = ({
  table,
  filters = [],
  page = 1,
  pageSize = 10,
  usePagination = true,
}: UseFetchAllParams) => {
  return useQuery({
    // Auto-refetch on param change
    queryKey: [table, filters, page, pageSize, usePagination],
    queryFn: async () => {
      const result = await fetchAll({
        table,
        filters,
        page,
        pageSize,
        usePagination,
      });
      // Ensure it returns { data: [], count: number }
      return result;
    },
    // KeepPreviousData in React Query v5
    placeholderData: (prev) => prev,
  });
};
