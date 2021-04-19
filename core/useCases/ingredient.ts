import {Ingredient, IngredientPossiblyWithId, IngredientWithId} from 'core/entities/ingredient';

export type SaveIngredientsService = (ingredients: Ingredient[]) => Promise<IngredientWithId[]>;
export type LoadIngredientsService = () => Promise<IngredientWithId[]>;
export type CreateIngredientService = (ingredient: Ingredient) => Promise<IngredientWithId>;

export const createIngredient = async (
  createIngredientService: CreateIngredientService,
  ingredient: Ingredient
): Promise<IngredientWithId> => createIngredientService(ingredient);

export const loadIngredients = async (
  loadIngredientsService: LoadIngredientsService
): Promise<IngredientWithId[]> => loadIngredientsService();

export const saveIngredients = async (
  saveIngredientsService: SaveIngredientsService,
  ingredients: IngredientPossiblyWithId[]
) => saveIngredientsService(ingredients);
