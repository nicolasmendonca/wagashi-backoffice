import axios from 'axios'
import {IngredientWithId} from '@wagashi-backoffice/core';
import { IngredientsRepository } from '../../services';

export const ingredientsLocalStorageRepository: IngredientsRepository = {
  load: async () =>  (await axios.get<IngredientWithId[]>('/api/ingredients')).data,
  save: async (ingredients: IngredientWithId[]) => (await axios.post<IngredientWithId[]>('/api/ingredients', { ingredients })).data,
};
