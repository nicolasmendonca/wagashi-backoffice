import axios from 'axios';
import {Recipe, RecipeWithId} from '@wagashi-backoffice/core';
import {RecipesRepository} from '../../services/backendApi/recipeService';

export const recipesBackendApiRepository: RecipesRepository = {
  load: async () => (await axios.get<RecipeWithId[]>('/api/recipes')).data,
  save: async (recipe: Recipe) => (await axios.post<RecipeWithId>('/api/recipes', {recipe})).data,
  delete: async (recipeId: string) => (await axios.delete<RecipeWithId[]>(`/api/recipes/${recipeId}`)).data,
  update: async (recipeId: string, recipe: RecipeWithId) => (await axios.put<RecipeWithId>(`/api/recipes/${recipeId}`, {recipe})).data,
};
