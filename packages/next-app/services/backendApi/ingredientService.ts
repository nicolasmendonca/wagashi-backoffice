import {Ingredient, IngredientWithId, CreateIngredientService, LoadIngredientsService} from '@wagashi-backoffice/core';
import { BackendApiRepository } from './types';

export type IngredientsRepository = BackendApiRepository<Ingredient>;

export const buildLoadIngredientsService = (
  ingredientsRepository: IngredientsRepository
): LoadIngredientsService => async () => ingredientsRepository.load();

export const buildCreateIngredientService = (
  ingredientsRepository: IngredientsRepository
): CreateIngredientService => {
  return async (ingredient: Ingredient): Promise<IngredientWithId> => ingredientsRepository.save(ingredient);
  };
