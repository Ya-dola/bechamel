'use client';

import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { hardDeleteRecords } from '@/services/supabase_service';

// A basic interface for items that have an id property
export interface Item {
  id: string | number;
}

// The shape of the cached query data
export interface QueryData<T extends Item = Item> {
  data: T[];
  count: number;
}

export const useHardDelete = (table: string) => {
  const queryClient = useQueryClient();
  const key: QueryKey = [table];

  return useMutation({
    mutationFn: async (ids: (string | number)[]) => {
      return await hardDeleteRecords({ table, ids });
    },
    onMutate: async (ids: (string | number)[]) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previousData = queryClient.getQueryData<QueryData<Item>>([
        {
          queryKey: key,
        },
      ]);
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
      return { previousData };
    },
    onError: (error, ids, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([{ queryKey: key }], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};
