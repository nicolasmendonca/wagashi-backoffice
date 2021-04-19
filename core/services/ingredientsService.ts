import {Ingredient, IngredientPossiblyWithId, IngredientWithId} from 'core/entities/ingredient';
import {
  CreateIngredientService,
  LoadIngredientsService,
  SaveIngredientsService,
} from 'core/useCases/ingredient';
import {nanoid} from 'nanoid';

export interface PersistenceRepository<T> {
  save: (value: T) => Promise<T>;
  load: () => Promise<T>;
}

export type IngredientsRepository = PersistenceRepository<IngredientWithId[]>;

export const createSaveIngredientsService = (
  ingredientsRepository: IngredientsRepository
): SaveIngredientsService => {
  return (ingredients: IngredientPossiblyWithId[]) => {
    // Create an id for each ingredient in case it doesn't have one
    const ingredientWithIds = ingredients.map(ingredient => {
      return {
        ...ingredient,
        id: ingredient.id ?? nanoid(),
      };
    });
    return ingredientsRepository.save(ingredientWithIds);
  };
};

export const buildLoadIngredientsService = (
  ingredientsRepository: IngredientsRepository
): LoadIngredientsService => ingredientsRepository.load;

export const buildCreateIngredientService = (
  ingredientsRepository: IngredientsRepository
): CreateIngredientService => {
  return async (ingredient: Ingredient): Promise<IngredientWithId> => {
    const ingredientsList = await ingredientsRepository.load();
    const ingredientWithId = {id: nanoid(), ...ingredient};
    ingredientsList.push(ingredientWithId);
    ingredientsRepository.save(ingredientsList);
    return ingredientWithId;
  };
};
