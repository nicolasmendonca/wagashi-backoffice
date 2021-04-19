import {Recipe, RecipeWithId} from 'core/entities/recipe';
import {nanoid} from 'nanoid';
import {CreateRecipeService, LoadRecipesService} from '../useCases/recipe';
import {PersistenceRepository} from './types';

export type RecipesRepository = PersistenceRepository<RecipeWithId[]>;

export const buildCreateRecipeService = (
  recipesRepository: RecipesRepository
): CreateRecipeService => {
  return async (recipe: Recipe): Promise<RecipeWithId> => {
    const recipesList = await recipesRepository.load();
    const recipeWithId = {id: nanoid(), ...recipe};
    recipesList.push(recipeWithId);
    await recipesRepository.save(recipesList);
    return recipeWithId;
  };
};

export const buildLoadRecipesService = (
  recipesRepository: RecipesRepository
): LoadRecipesService => {
  return async () => {
    const recipes = await recipesRepository.load();
    return recipes;
  };
};
