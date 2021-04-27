import {nanoid} from 'nanoid';
import {
  Ingredient,
  IngredientWithId,
  CreateIngredientService,
  LoadIngredientsService,
  UpdateIngredientService,
  DeleteIngredientsService,
} from '@wagashi-backoffice/core';
import {LocalStorageRepository} from './types';
import produce from 'immer';

export type IngredientsRepository = LocalStorageRepository<IngredientWithId[]>;

export const buildLoadIngredientsService = (ingredientsRepository: IngredientsRepository): LoadIngredientsService => ingredientsRepository.load;

export const buildCreateIngredientService = (ingredientsRepository: IngredientsRepository): CreateIngredientService => {
  return async (ingredient: Ingredient): Promise<IngredientWithId> => {
    const ingredientsList = await ingredientsRepository.load();
    const ingredientWithId = {id: nanoid(), ...ingredient};
    ingredientsList.push(ingredientWithId);
    ingredientsRepository.save(ingredientsList);
    return ingredientWithId;
  };
};

export const buildUpdateIngredientService = (ingredientsRepository: IngredientsRepository): UpdateIngredientService => {
  return async (ingredientId: string, ingredient: Partial<IngredientWithId>) => {
    const ingredientList = await ingredientsRepository.load();
    const updatedIngredientIndex = ingredientList.findIndex((ingredient) => ingredient.id === ingredientId);
    if (updatedIngredientIndex === -1) throw new Error('No se encontró el ingrediente');
    const updatedIngredient = {...ingredientList[updatedIngredientIndex], ...ingredient, id: ingredientId};
    ingredientList[updatedIngredientIndex] = updatedIngredient;
    await ingredientsRepository.save(ingredientList);
    return updatedIngredient;
  };
};

export const buildDeleteIngredientsService = (ingredientsRepository: IngredientsRepository): DeleteIngredientsService => {
  return async (deletedIngredientIds: string[]) => {
    const ingredientList = await ingredientsRepository.load();
    const remainingIngredients = ingredientList.filter((ingredient) => !deletedIngredientIds.includes(ingredient.id));
    await ingredientsRepository.save(remainingIngredients);
    return remainingIngredients;
  };
};
