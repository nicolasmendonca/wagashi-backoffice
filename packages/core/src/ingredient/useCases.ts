import {Ingredient, IngredientPossiblyWithId, IngredientWithId} from './entities';
import { validateCreateIngredient } from './validators';

export type SaveIngredientsService = (ingredients: Ingredient[]) => Promise<IngredientWithId[]>;
export type LoadIngredientsService = () => Promise<IngredientWithId[]>;
export type CreateIngredientService = (ingredient: Ingredient) => Promise<IngredientWithId[]>;

export const createIngredient = async (
  createIngredientService: CreateIngredientService,
  loadIngredientsService: LoadIngredientsService,
  ingredient: Ingredient
): Promise<IngredientWithId[]> => {
  const ingredientList = await loadIngredientsService();
  const validatedIngredient = await validateCreateIngredient(ingredientList, ingredient);
  return createIngredientService(validatedIngredient)
};

export const loadIngredients = async (
  loadIngredientsService: LoadIngredientsService
): Promise<IngredientWithId[]> => loadIngredientsService();

export const saveIngredients = async (
  saveIngredientsService: SaveIngredientsService,
  ingredients: IngredientPossiblyWithId[]
) => saveIngredientsService(ingredients);