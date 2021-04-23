import {WithId} from '../utils/types';

export interface Ingredient {
  name: string;
}

export interface IngredientWithId extends Ingredient {
  id: string;
}
