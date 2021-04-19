import {WithId} from '../utils/types';

export interface RecipeIngredient {
  id: string;
  quantity: number;
}

export interface Recipe {
  name: string;
  ingredients: RecipeIngredient[];
}

export type RecipeWithId = WithId<Recipe>;
