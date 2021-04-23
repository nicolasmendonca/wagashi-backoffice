import { Recipe } from '@wagashi-backoffice/core';

export interface IEditRecipeBoxProps {
  onRecipeSave: (recipe: Recipe) => void;
  editRecipeId?: string;
}

export interface RecipeFormIngredient {
  _id: string;
  ingredientId: string;
  quantity: string;
}

export interface RecipeForm {
  name: string;
  ingredients: RecipeFormIngredient[];
}
