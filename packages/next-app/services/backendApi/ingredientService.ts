import {
  Ingredient,
  CreateIngredientService,
  LoadIngredientsService,
  DeleteIngredientsService,
  UpdateIngredientService,
  IngredientWithId,
} from '@wagashi-backoffice/core';
import {BackendApiRepository} from './types';

export type IngredientsRepository = BackendApiRepository<Ingredient>;

export const buildLoadIngredientsService = (ingredientsRepository: IngredientsRepository): LoadIngredientsService => async () => {
  const result = await ingredientsRepository.load();
  return result;
};

export const buildCreateIngredientService = (ingredientsRepository: IngredientsRepository): CreateIngredientService => {
  return (ingredient: Ingredient) => ingredientsRepository.save(ingredient);
};

export const buildDeleteIngredientsService = (ingredientsRepository: IngredientsRepository): DeleteIngredientsService => {
  return async (ingredientIds: string[]) => {
    await ingredientsRepository.delete(ingredientIds);
  };
};

export const buildUpdateIngredientsService = (ingredientsRepository: IngredientsRepository): UpdateIngredientService => {
  return async (ingredientId: string, ingredient: IngredientWithId) => {
    const updatedIngredient = await ingredientsRepository.update(ingredientId, ingredient);
    return updatedIngredient;
  };
};
