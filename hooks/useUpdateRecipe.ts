import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateRecipe,
  RecipeInput,
  RecipeRecord,
} from '@/services/supabase_service';

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation<
    RecipeRecord[],
    Error,
    { recipeId: string; data: RecipeInput }
  >({
    mutationFn: async ({ recipeId, data }) => {
      return await updateRecipe(recipeId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};
