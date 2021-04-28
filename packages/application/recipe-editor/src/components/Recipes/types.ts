import {Recipe, RecipeWithId} from '@wagashi-backoffice/core';

export interface IEditRecipeBoxProps {
  onRecipeCreate: (recipe: RecipeWithId) => void;
  onRecipeUpdate: (recipe: RecipeWithId) => void;
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
