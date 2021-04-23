import {Ingredient, CreateIngredientService, LoadIngredientsService} from '@wagashi-backoffice/core';
import { BackendApiRepository } from './types';

export type IngredientsRepository = BackendApiRepository<Ingredient>;

export const buildLoadIngredientsService = (
  ingredientsRepository: IngredientsRepository
): LoadIngredientsService => async () => {
  const result = await ingredientsRepository.load();
  return result
}

export const buildCreateIngredientService = (
  ingredientsRepository: IngredientsRepository
): CreateIngredientService => {
  return (ingredient: Ingredient) => ingredientsRepository.save(ingredient)
};
