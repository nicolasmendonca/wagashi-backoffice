import React from 'react';
import {Ingredient, IngredientWithId} from 'core/entities/ingredient';
import {createIngredient, loadIngredients} from 'core/useCases/ingredient';
import {
  buildCreateIngredientService,
  buildLoadIngredientsService,
} from 'core/services/ingredientService';
import {ingredientsLocalStorageRepository} from '../repositories/ingredientRepository';
import {buildCreateRecipeService, buildLoadRecipesService} from 'core/services/recipeService';
import {recipesLocalStorageRepository} from '../repositories/recipeRepository';
import {Recipe, RecipeWithId} from 'core/entities/recipe';
import {createRecipe, loadRecipes} from 'core/useCases/recipe';

interface App {
  loadIngredients: () => Promise<IngredientWithId[]>;
  createIngredient: (ingredient: Ingredient) => Promise<IngredientWithId>;
  createRecipe: (recipe: Recipe) => Promise<RecipeWithId>;
  loadRecipes: () => Promise<RecipeWithId[]>;
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

export const AppContextProvider: React.FC = ({children}) => {
  return (
    <AppContext.Provider
      value={{
        loadIngredients: () => loadIngredients(loadIngredientsService),
        createIngredient: (ingredient: Ingredient) =>
          createIngredient(createIngredientService, ingredient),
        createRecipe: (recipe: Recipe) => createRecipe(createRecipeService, recipe),
        loadRecipes: () => loadRecipes(loadRecipesService),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
