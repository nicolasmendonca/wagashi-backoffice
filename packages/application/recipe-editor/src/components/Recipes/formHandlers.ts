import {nanoid} from 'nanoid';
import { Recipe } from '@wagashi-backoffice/core';
import { RecipeForm, RecipeFormIngredient } from './types';

export const createIngredientFormValues = (ingredient: Partial<RecipeFormIngredient> = {}) => {
  const defaultValues = {
    _id: ingredient._id ? ingredient._id : nanoid(),
    ingredientId: '',
    quantity: '',
  };
  return {
    ...defaultValues,
    ...ingredient,
  };
};

/** Converts recipe entity to the compatible component form values */
export const convertRecipeToForm = (recipe: Recipe): RecipeForm => {
  const ingredients = recipe.ingredients.map((ingredient) => {
    return {
      _id: nanoid(),
      ingredientId: ingredient.id,
      quantity: ingredient.quantity.toString(),
    };
  });
  // Add empty field in case the user wants to add a new ingredient
  ingredients.push(createIngredientFormValues());
  return {
    name: recipe.name,
    ingredients,
  };
};

export const convertFormValuesToRecipe = (recipeForm: RecipeForm): Recipe => {
  return {
    name: recipeForm.name,
    ingredients: recipeForm.ingredients
      // filter out empty ingredient values
      .filter((ingredient) => ingredient.ingredientId !== '' || ingredient.quantity !== '')
      .map((ingredient) => {
        return {
          id: ingredient.ingredientId,
          quantity: Number(ingredient.quantity),
        };
      }),
  };
};
