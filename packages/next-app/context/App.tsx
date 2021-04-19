import React from 'react';
import {
  Ingredient,
  Recipe,
  RecipeWithId,
  IngredientWithId,
  createIngredient,
  loadIngredients,
  createRecipe,
  loadRecipes,
} from '@wagashi-backoffice/core';
import {
  buildCreateIngredientService,
  buildLoadIngredientsService,
  buildCreateRecipeService,
  buildDeleteRecipeService,
  buildLoadRecipesService,
  buildUpdateRecipeService
} from '../services'
import {ingredientsLocalStorageRepository} from '../repositories/ingredientRepository';
import {recipesLocalStorageRepository} from '../repositories/recipeRepository';

interface App {
  loadIngredients: () => Promise<IngredientWithId[]>;
  createIngredient: (ingredient: Ingredient) => Promise<IngredientWithId>;
  createRecipe: (recipe: Recipe) => Promise<RecipeWithId>;
  loadRecipes: () => Promise<RecipeWithId[]>;
  deleteRecipe: (recipeId: string) => Promise<boolean>;
  updateRecipe: (recipeId: string, recipe: Recipe) => Promise<RecipeWithId>;
}

const AppContext = React.createContext<App>(undefined);

export const useApp = (): App => {
  const value = React.useContext(AppContext);
  if (value === undefined) {
    throw new Error('Wrap your component with AppContextProvider');
  }
  return value;
};

const loadIngredientsService = buildLoadIngredientsService(ingredientsLocalStorageRepository);
const createIngredientService = buildCreateIngredientService(ingredientsLocalStorageRepository);
const createRecipeService = buildCreateRecipeService(recipesLocalStorageRepository);
const loadRecipesService = buildLoadRecipesService(recipesLocalStorageRepository);
const deleteRecipeService = buildDeleteRecipeService(recipesLocalStorageRepository);
const updateRecipeService = buildUpdateRecipeService(recipesLocalStorageRepository);

export const AppContextProvider: React.FC = ({children}) => {
  return (
    <AppContext.Provider
      value={React.useMemo(() => ({
        loadIngredients: () => loadIngredients(loadIngredientsService),
        createIngredient: (ingredient: Ingredient) =>
          createIngredient(createIngredientService, ingredient),
        createRecipe: (recipe: Recipe) => createRecipe(createRecipeService, recipe),
        loadRecipes: () => loadRecipes(loadRecipesService),
        deleteRecipe: (recipeId: string) => deleteRecipeService(recipeId),
        updateRecipe: (recipeId: string, recipe: Recipe) => updateRecipeService(recipeId, recipe),
      }), [])}
    >
      {children}
    </AppContext.Provider>
  );
};
