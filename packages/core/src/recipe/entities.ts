import {WithId} from '../utils/types';

export interface RecipeIngredient {
  id: string;
  quantity: number;
}

export interface Recipe {
  name: string;
  ingredients: RecipeIngredient[];
}

export interface RecipeWithId extends Recipe {
  id: string;
}

export interface RecipeIngredientSummary {
  id: string;
  total: number;
}
