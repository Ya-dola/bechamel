'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insertCategory } from '@/services/supabase_service';

export const useInsertCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCategory: { name: string }) => {
      return await insertCategory(newCategory);
    },
    onSuccess: () => {
      // Invalidate the categories query (assuming key is ['categories'])
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
