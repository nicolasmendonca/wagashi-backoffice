import {Recipe, RecipeWithId} from 'core/entities/recipe';

export type CreateRecipeService = (recipe: Recipe) => Promise<RecipeWithId>;
export type LoadRecipesService = () => Promise<RecipeWithId[]>;

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
