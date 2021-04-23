import {
  Recipe,
  RecipeWithId,
  CreateRecipeService,
  DeleteRecipeService,
  LoadRecipesService,
  UpdateRecipeService,
} from '@wagashi-backoffice/core';
import {BackendApiRepository} from './types';

export type RecipesRepository = BackendApiRepository<Recipe>;

export const buildCreateRecipeService = (
  recipesRepository: RecipesRepository
): CreateRecipeService => {
  return async (recipe: Recipe): Promise<RecipeWithId> => recipesRepository.save(recipe);
};

export const buildLoadRecipesService = (
  recipesRepository: RecipesRepository
): LoadRecipesService => {
  return async () => recipesRepository.load();
};

export const buildDeleteRecipeService = (
  recipesRepository: RecipesRepository
): DeleteRecipeService => {
  return async (recipeId: string) => {
    await recipesRepository.delete(recipeId);
    return recipesRepository.load()
  };
};

export const buildUpdateRecipeService = (
  recipesRepository: RecipesRepository
): UpdateRecipeService => {
  return async (recipeId: string, recipe: RecipeWithId) => {
    return recipesRepository.update(recipeId, recipe)
  };
};
