import {Ingredient, IngredientWithId} from './entities';
import {validateCreateIngredient} from './validators';

export type CreateIngredientService = (ingredient: Ingredient) => Promise<IngredientWithId>;
export type LoadIngredientsService = () => Promise<IngredientWithId[]>;
export type UpdateIngredientService = (ingredientId: string, ingredient: Partial<IngredientWithId>) => Promise<IngredientWithId>;
export type DeleteIngredientsService = (ingredientIds: string[]) => Promise<IngredientWithId[]>;

export const createIngredient = async (
  createIngredientService: CreateIngredientService,
  ingredientList: IngredientWithId[],
  ingredient: Ingredient
): Promise<IngredientWithId> => {
  const validatedIngredient = await validateCreateIngredient(ingredientList, ingredient);
  return createIngredientService(validatedIngredient);
};

export const updateIngredient = async (
  updateIngredientService: UpdateIngredientService,
  ingredientId: string,
  updatedIngredient: Partial<IngredientWithId>
): Promise<IngredientWithId> => {
  // TODO add validation here
  return updateIngredientService(ingredientId, updatedIngredient);
};

export const loadIngredients = async (loadIngredientsService: LoadIngredientsService): Promise<IngredientWithId[]> => loadIngredientsService();

export const deleteIngredient = async (deleteIngredientService: DeleteIngredientsService, ingredientIds: string[]): Promise<IngredientWithId[]> =>
  deleteIngredientService(ingredientIds);
