import {LoadIngredientsService} from '../ingredient';
import {Recipe, RecipeIngredient, RecipeIngredientSummary, RecipeWithId} from './entities';
import {validateCreateRecipe, validateUpdateRecipe} from './validators';

export type CreateRecipeService = (recipe: Recipe) => Promise<RecipeWithId>;
export type LoadRecipesService = () => Promise<RecipeWithId[]>;
export type DeleteRecipeService = (recipeId: string) => Promise<RecipeWithId[]>;
export type UpdateRecipeService = (recipeId: string, recipe: Recipe) => Promise<RecipeWithId>;

export const createRecipe = async (
  createRecipeService: CreateRecipeService,
  loadIngredientsService: LoadIngredientsService,
  recipe: Recipe
): Promise<RecipeWithId> => {
  const validatedRecipe = await validateCreateRecipe(loadIngredientsService, recipe);
  return createRecipeService(validatedRecipe);
};

export const loadRecipes = async (loadRecipesService: LoadRecipesService): Promise<RecipeWithId[]> => {
  return loadRecipesService();
};

export const deleteRecipe = async (deleteRecipeService: DeleteRecipeService, recipeId: string): Promise<RecipeWithId[]> => {
  return deleteRecipeService(recipeId);
};

export const updateRecipe = async (
  updateRecipeService: UpdateRecipeService,
  loadIngredientsService: LoadIngredientsService,
  recipeId: string,
  recipe: Recipe
): Promise<RecipeWithId> => {
  const validatedRecipe = await validateUpdateRecipe(loadIngredientsService, recipe);
  return updateRecipeService(recipeId, validatedRecipe);
};

/**
 * Returns An array of objects that contains the ingredient id and the total of quantities required to elaborate the recipes
 * provided as an argument
 */
export const calculateIngredientQuantities = (recipes: RecipeWithId[]): RecipeIngredientSummary[] => {
  type IngredientId = string;

  const ingredients: RecipeIngredient[] = recipes.map((recipe) => recipe.ingredients).flat();
  const dedupedIngredients: IngredientId[] = ingredients
    .map((ingredient) => ingredient.id)
    .reduce((dedupedList, ingredientId) => {
      if (dedupedList.includes(ingredientId)) {
        // already exist in the list
        return dedupedList;
      }
      dedupedList.push(ingredientId);
      return dedupedList;
    }, []);

  const recipeIngredientsSummary: RecipeIngredientSummary[] = dedupedIngredients.reduce((summary: RecipeIngredientSummary[], ingredientId: IngredientId) => {
    const recipeIngredients = ingredients.filter((ingredient) => ingredient.id === ingredientId);
    summary.push({
      id: ingredientId,
      total: recipeIngredients.reduce((total, recipeIngredient) => (total += recipeIngredient.quantity), 0),
    });
    return summary;
  }, []);

  return recipeIngredientsSummary;
};
