import React from 'react';
import {Ingredient, IngredientWithId} from '../core/entities/ingredient';
import {createIngredient, loadIngredients} from 'core/useCases/ingredient';
import {
  buildCreateIngredientService,
  buildLoadIngredientsService,
} from '../core/services/ingredientsService';
import {ingredientsLocalStorageRepository} from '../repositories/ingredientRepository';

interface App {
  getIngredients: () => Promise<IngredientWithId[]>;
  createIngredient: (ingredient: Ingredient) => Promise<IngredientWithId>;
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

export const AppContextProvider: React.FC = ({children}) => {
  return (
    <AppContext.Provider
      value={{
        getIngredients: () => loadIngredients(loadIngredientsService),
        createIngredient: (ingredient: Ingredient) =>
          createIngredient(createIngredientService, ingredient),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
