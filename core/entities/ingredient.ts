import {PossiblyWithId, WithId} from './types';

export interface Ingredient {
  name: string;
}

export type IngredientWithId = WithId<Ingredient>;
export type IngredientPossiblyWithId = PossiblyWithId<Ingredient>;
