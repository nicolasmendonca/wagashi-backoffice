import {nanoid} from 'nanoid';
import {Ingredient, IngredientWithId, CreateIngredientService, LoadIngredientsService} from '@wagashi-backoffice/core';
import {LocalStorageRepository} from './types';

export type IngredientsRepository = LocalStorageRepository<IngredientWithId[]>;

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