import {Recipe, RecipeWithId} from 'core/entities/recipe';

export type CreateRecipeService = (recipe: Recipe) => Promise<RecipeWithId>;
export type LoadRecipesService = () => Promise<RecipeWithId[]>;
export type DeleteRecipesService = (recipeId: string) => Promise<boolean>;
export type UpdateRecipeService = (recipeId: string, recipe: Recipe) => Promise<RecipeWithId>;

export const createRecipe = async (
  createRecipeService: CreateRecipeService,
  recipe: Recipe
): Promise<RecipeWithId> => {
  return createRecipeService(recipe);
};

export const loadRecipes = async (
  loadRecipesService: LoadRecipesService
): Promise<RecipeWithId[]> => {
  return loadRecipesService();
};

export const deleteRecipe = async (
  deleteRecipeService: DeleteRecipesService,
  recipeId: string
): Promise<boolean> => {
  return deleteRecipeService(recipeId);
};

export const updateRecipe = async (
  updateRecipeService: UpdateRecipeService,
  recipeId: string,
  recipe: Recipe
): Promise<RecipeWithId> => {
  return updateRecipeService(recipeId, recipe);
};
