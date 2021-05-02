import {Recipe, RecipeWithId, CreateRecipeService, DeleteRecipeService, LoadRecipesService, UpdateRecipeService} from '@wagashi-backoffice/core';

export interface RecipesRepository {
  save: (value: Recipe) => Promise<RecipeWithId>;
  load: () => Promise<RecipeWithId[]>;
  delete: (recipeId: string) => Promise<RecipeWithId[]>;
  update: (id: string, value: RecipeWithId) => Promise<RecipeWithId>;
}

export const buildCreateRecipeService = (recipesRepository: RecipesRepository): CreateRecipeService => {
  return async (recipe: Recipe): Promise<RecipeWithId> => recipesRepository.save(recipe);
};

export const buildLoadRecipesService = (recipesRepository: RecipesRepository): LoadRecipesService => {
  return async () => recipesRepository.load();
};

export const buildDeleteRecipeService = (recipesRepository: RecipesRepository): DeleteRecipeService => {
  return async (recipeId: string) => {
    await recipesRepository.delete(recipeId);
  };
};

export const buildUpdateRecipeService = (recipesRepository: RecipesRepository): UpdateRecipeService => {
  return async (recipeId: string, recipe: RecipeWithId) => {
    return recipesRepository.update(recipeId, recipe);
  };
};
