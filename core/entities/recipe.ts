import {PossiblyWithId, WithId} from './types';
import {Ingredient, IngredientPossiblyWithId, IngredientWithId} from './ingredient';

export interface Recipe {
  name: string;
  ingredients: Ingredient[];
}

export interface RecipeWithId extends WithId<Recipe> {
  ingredients: IngredientWithId[];
}

export interface RecipePossiblyWithId extends PossiblyWithId<Recipe> {
  ingredients: IngredientPossiblyWithId[];
}
