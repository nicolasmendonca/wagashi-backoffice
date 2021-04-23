import { LoadIngredientsService } from '../ingredient';
import {Recipe, RecipeWithId} from './entities';
import { validateCreateRecipe } from './validators';

export type CreateRecipeService = (recipe: Recipe) => Promise<RecipeWithId>;
export type LoadRecipesService = () => Promise<RecipeWithId[]>;
export type DeleteRecipeService = (recipeId: string) => Promise<RecipeWithId[]>;
export type UpdateRecipeService = (recipeId: string, recipe: Recipe) => Promise<RecipeWithId>;

export const createRecipe = async (
  createRecipeService: CreateRecipeService,
  loadIngredientsService: LoadIngredientsService,
  recipe: Recipe
): Promise<RecipeWithId> => {
  const validatedRecipe = await validateCreateRecipe(loadIngredientsService, recipe)
  return createRecipeService(validatedRecipe);
};

export const loadRecipes = async (
  loadRecipesService: LoadRecipesService
): Promise<RecipeWithId[]> => {
  return loadRecipesService();
};

export const deleteRecipe = async (
  deleteRecipeService: DeleteRecipeService,
  recipeId: string
): Promise<RecipeWithId[]> => {
  return deleteRecipeService(recipeId);
};

export const updateRecipe = async (
  updateRecipeService: UpdateRecipeService,
  recipeId: string,
  recipe: Recipe
): Promise<RecipeWithId> => {
  return updateRecipeService(recipeId, recipe);
};
