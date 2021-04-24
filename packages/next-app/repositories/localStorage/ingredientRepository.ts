import {IngredientWithId} from '@wagashi-backoffice/core';
import { IngredientsRepository } from '../../services/localStorage';
import {createLocalStorageRepository} from './localStorage';

const repository = createLocalStorageRepository('ingredient');
export const ingredientsLocalStorageRepository: IngredientsRepository = {
  load: async () => {
    const loadedIngredients = JSON.parse(repository.load() ?? '[]') as IngredientWithId[];
    return loadedIngredients;
  },
  save: async (ingredients: IngredientWithId[]) => {
    repository.save(JSON.stringify(ingredients));
    return ingredients;
  },
};
