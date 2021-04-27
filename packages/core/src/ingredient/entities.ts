export interface Ingredient {
  name: string;
  quantity?: number;
  measure?: string;
  price?: number;
}

export interface IngredientWithId extends Ingredient {
  id: string;
}
