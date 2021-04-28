import axios from 'axios';
import {Ingredient, IngredientWithId} from '@wagashi-backoffice/core';
import {IngredientsRepository} from '../../services/backendApi/ingredientService';

export const ingredientsBackendApiRepository: IngredientsRepository = {
  load: async () => (await axios.get<IngredientWithId[]>('/api/ingredients')).data,
  save: async (ingredient: Ingredient) => (await axios.post<IngredientWithId>('/api/ingredients', {ingredient})).data,
  delete: async (ingredientIds: string[]) =>
    (
      await axios.delete<IngredientWithId[]>(`/api/ingredients`, {
        data: ingredientIds,
      })
    ).data,
  update: async (ingredientId: string, ingredient: IngredientWithId) =>
    (await axios.put<IngredientWithId>(`/api/ingredients/${ingredientId}`, ingredient)).data,
};
