import {PossiblyWithId, WithId} from './types';
import {Ingredient, IngredientPossiblyWithId, IngredientWithId} from './ingredient';

interface RecipeIngredient {
  id: string;
  quantity: number;
}

export interface Recipe {
  name: string;
  ingredients: RecipeIngredient[];
}

export type RecipeWithId = WithId<Recipe>;
