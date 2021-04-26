import {buildCreateRecipeService, buildDeleteRecipeService, buildLoadRecipesService, buildUpdateRecipeService} from './recipeService';
import {buildCreateIngredientService, buildLoadIngredientsService} from './ingredientService';
import {ingredientsLocalStorageRepository, recipesLocalStorageRepository} from '../../repositories/localStorage';

export const localStorageApiService = {
  createRecipeService: buildCreateRecipeService(recipesLocalStorageRepository),
  loadRecipesService: buildLoadRecipesService(recipesLocalStorageRepository),
  createIngredientService: buildCreateIngredientService(ingredientsLocalStorageRepository),
  loadIngredientsService: buildLoadIngredientsService(ingredientsLocalStorageRepository),
  updateRecipeService: buildUpdateRecipeService(recipesLocalStorageRepository),
  deleteRecipeService: buildDeleteRecipeService(recipesLocalStorageRepository),
};
