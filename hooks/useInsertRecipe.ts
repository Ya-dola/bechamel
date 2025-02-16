import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  insertRecipe,
  RecipeInput,
  RecipeRecord,
} from '@/services/supabase_service';

export const useInsertRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation<RecipeRecord[], Error, RecipeInput>({
    mutationFn: async (newRecipe: RecipeInput) => {
      return await insertRecipe(newRecipe);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};
