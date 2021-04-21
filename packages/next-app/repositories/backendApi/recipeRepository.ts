import axios from 'axios'
import {RecipeWithId} from '@wagashi-backoffice/core';
import { RecipesRepository } from '../../services';

export const recipesLocalStorageRepository: RecipesRepository = {
  load: async () =>  (await axios.get<RecipeWithId[]>('/api/recipes')).data,
  save: async (recipes: RecipeWithId[]) => (await axios.post<RecipeWithId[]>('/api/recipes', { recipes })).data,
};
