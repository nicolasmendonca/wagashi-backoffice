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

export const buildDeleteRecipeService = (
  recipesRepository: RecipesRepository
): DeleteRecipesService => {
  return async (recipeId: string) => {
    const recipes = await recipesRepository.load();
    const updatedRecipes = produce(recipes, (draft) => {
      const recipe = draft.findIndex((recipe) => recipe.id === recipeId);
      draft.splice(recipe, 1);
    });
    await recipesRepository.save(updatedRecipes);
    return true;
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
