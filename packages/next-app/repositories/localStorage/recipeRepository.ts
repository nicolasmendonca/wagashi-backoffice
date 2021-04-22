import {RecipeWithId} from '@wagashi-backoffice/core';
import { RecipesRepository } from '../../services';
import {createLocalStorageRepository} from './localStorage';

const repository = createLocalStorageRepository('recipe');
export const recipesLocalStorageRepository: RecipesRepository = {
  load: async () => {
    const loadedIngredients = JSON.parse(repository.load() ?? '[]') as RecipeWithId[];
    return loadedIngredients;
  },
  save: async (recipes: RecipeWithId[]) => {
    repository.save(JSON.stringify(recipes));
    return recipes;
  },
};