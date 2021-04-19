import { IngredientWithId, LoadIngredientsService } from "../ingredient";
import { validateIngredientExists } from "../ingredient/validators";
import { Validator } from '../utils/types';
import { Recipe } from "./entities";

// Use Case Validators -----------------------

export const validateCreateRecipe: Validator<Recipe> = async (
  loadIngredientsService: LoadIngredientsService,
  recipe: Recipe
) => {
  let validatedRecipe = recipe;
  validatedRecipe = await validateRecipeHasName(recipe);
  validatedRecipe = await validateRecipeContainsIngredients(recipe);

  const ingredientList = await loadIngredientsService();
  validatedRecipe = await validateIngredientsExist(ingredientList, recipe);
  return validatedRecipe;
};

// Single Responsibility Validators -----------------------
const validateRecipeHasName: Validator<Recipe> = async (recipe: Recipe) => {
  if (!recipe.name) {
    throw new Error("Por favor ingresa un nombre para la receta");
  }
  return recipe;
};

const validateRecipeContainsIngredients: Validator<Recipe> = async (
  recipe: Recipe
) => {
  if (recipe.ingredients.length === 0) {
    throw new Error("La receta debe contener ingredientes");
  }
  return recipe;
};

const validateIngredientsExist: Validator<Recipe> = async (
  ingredientList: IngredientWithId[],
  recipe: Recipe
) => {
  recipe.ingredients.forEach((recipeIngredient) => {
    validateIngredientExists(ingredientList, recipeIngredient.id);
  });
  return recipe;
}
