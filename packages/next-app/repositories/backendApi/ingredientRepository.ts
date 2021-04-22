import axios from 'axios'
import { Ingredient, IngredientWithId} from '@wagashi-backoffice/core';
import { IngredientsRepository } from '../../services/backendApi';


export const ingredientsLocalStorageRepository: IngredientsRepository = {
  load: async () =>  (await axios.get<IngredientWithId[]>('/api/ingredients')).data,
  save: async (ingredient: Ingredient) => (await axios.post<IngredientWithId>('/api/ingredients', { ingredient })).data,
  delete: async (ingredientId: string) => (await axios.delete<IngredientWithId[]>(`/api/ingredients/${ingredientId}`)).data
};
