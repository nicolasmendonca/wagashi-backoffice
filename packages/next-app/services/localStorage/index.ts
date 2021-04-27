import {buildCreateRecipeService, buildDeleteRecipeService, buildLoadRecipesService, buildUpdateRecipeService} from './recipeService';
import {buildCreateIngredientService, buildDeleteIngredientsService, buildLoadIngredientsService, buildUpdateIngredientService} from './ingredientService';
import {ingredientsLocalStorageRepository, recipesLocalStorageRepository} from '../../repositories/localStorage';

export const localStorageApiService = {
  createRecipeService: buildCreateRecipeService(recipesLocalStorageRepository),
  loadRecipesService: buildLoadRecipesService(recipesLocalStorageRepository),
  createIngredientService: buildCreateIngredientService(ingredientsLocalStorageRepository),
  loadIngredientsService: buildLoadIngredientsService(ingredientsLocalStorageRepository),
  deleteIngredientsService: buildDeleteIngredientsService(ingredientsLocalStorageRepository),
  updateIngredientService: buildUpdateIngredientService(ingredientsLocalStorageRepository),
  updateRecipeService: buildUpdateRecipeService(recipesLocalStorageRepository),
  deleteRecipeService: buildDeleteRecipeService(recipesLocalStorageRepository),
};
