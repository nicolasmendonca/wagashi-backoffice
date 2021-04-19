import {Ingredient, IngredientPossiblyWithId, IngredientWithId} from 'core/entities/ingredient';
import {CreateIngredientService, LoadIngredientsService} from 'core/useCases/ingredient';
import {nanoid} from 'nanoid';
import {PersistenceRepository} from './types';

export type IngredientsRepository = PersistenceRepository<IngredientWithId[]>;

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
