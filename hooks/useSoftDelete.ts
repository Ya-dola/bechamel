// hooks/useSoftDelete.ts
'use client';

import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { softDeleteRecords } from '@/services/supabase_service';

// A basic interface for items that have an id property
export interface Item {
  id: string | number;
}

// The shape of the cached query data
export interface QueryData<T extends Item = Item> {
  data: T[];
  count: number;
}

export const useSoftDelete = (table: string) => {
  const queryClient = useQueryClient();
  // Build the query key as an array
  const key: QueryKey = [table];

  return useMutation({
    mutationFn: async (ids: (string | number)[]) => {
      return await softDeleteRecords({ table, ids });
    },
    // Optimistically update the cache by removing the deleted items
    onMutate: async (ids: (string | number)[]) => {
      // Cancel any outgoing refetches for this query
      await queryClient.cancelQueries({ queryKey: key });
      // Snapshot the previous value from cache
      const previousData = queryClient.getQueryData<QueryData<Item>>([
        {
          queryKey: key,
        },
      ]);
      // Optimistically update the cache
      queryClient.setQueryData<QueryData<Item>>(
        [{ queryKey: key }],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((item) => !ids.includes(item.id)),
            count: oldData.count - ids.length,
          };
        },
      );
      // Return context for potential rollback on error
      return { previousData };
    },
    // On error, roll back to the previous cache state
    onError: (error, ids, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([{ queryKey: key }], context.previousData);
      }
    },
    // After mutation (whether success or error), invalidate the query so it refetches
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};
