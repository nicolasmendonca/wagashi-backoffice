import {buildCreateRecipeService, buildDeleteRecipeService, buildLoadRecipesService, buildUpdateRecipeService} from './recipeService';
import {buildCreateIngredientService, buildDeleteIngredientsService, buildLoadIngredientsService, buildUpdateIngredientsService} from './ingredientService';
import {ingredientsBackendApiRepository, recipesBackendApiRepository} from '../../repositories/backendApi';

export const backendApiServices = {
  createRecipeService: buildCreateRecipeService(recipesBackendApiRepository),
  loadRecipesService: buildLoadRecipesService(recipesBackendApiRepository),
  createIngredientService: buildCreateIngredientService(ingredientsBackendApiRepository),
  loadIngredientsService: buildLoadIngredientsService(ingredientsBackendApiRepository),
  updateRecipeService: buildUpdateRecipeService(recipesBackendApiRepository),
  deleteRecipeService: buildDeleteRecipeService(recipesBackendApiRepository),
  deleteIngredientsService: buildDeleteIngredientsService(ingredientsBackendApiRepository),
  updateIngredientService: buildUpdateIngredientsService(ingredientsBackendApiRepository),
};
