import {nanoid} from 'nanoid';
import {Recipe} from 'entities/recipe';

export interface RecipeForm {
  name: string;
  ingredients: Array<{
    id: string,
    name: string,
    quantity: string,
  }>;
}

export const parseRecipeToForm = (recipe: Recipe): RecipeForm => {
  return {
    name: recipe.name,
    ingredients: recipe.ingredients.map(ingredient => {
      return {
        id: nanoid(),
        name: ingredient.name,
        quantity: ingredient.quantity > 0 ? `${ingredient.quantity}` : '',
      };
    }),
  };
};

export const parseFormToRecipe = (recipeForm: RecipeForm): Recipe => {
  return {
    name: recipeForm.name,
    ingredients: recipeForm.ingredients
      .filter(ingredient => ingredient.name !== '')
      .map(ingredient => {
        return {
          name: ingredient.name,
          quantity: Number(ingredient.quantity),
        };
      }),
  };
};
