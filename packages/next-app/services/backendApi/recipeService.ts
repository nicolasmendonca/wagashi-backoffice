import produce from 'immer';
import {nanoid} from 'nanoid';
import {
  Recipe,
  RecipeWithId,
  CreateRecipeService,
  DeleteRecipesService,
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
): DeleteRecipesService => {
  return async (recipeId: string) => {
    await recipesRepository.delete(recipeId);
    return recipesRepository.load()
  };
};

export const buildUpdateRecipeService = (
  recipesRepository: RecipesRepository
): UpdateRecipeService => {
  return async (recipeId: string, recipe: Recipe) => {
    const recipes = await recipesRepository.load();
    const updatedRecipes = produce(recipes, (draft) => {
      const recipeIndex = draft.findIndex((recipe) => recipe.id === recipeId);
      draft[recipeIndex] = {id: recipeId, ...recipe};
    });
    await recipesRepository.save(updatedRecipes);
    return updatedRecipes.find((recipe) => recipe.id === recipeId);
  };
};
