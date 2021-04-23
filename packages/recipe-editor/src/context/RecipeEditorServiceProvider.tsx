import {
  CreateIngredientService,
  CreateRecipeService,
  DeleteRecipeService,
  LoadIngredientsService,
  LoadRecipesService,
  UpdateRecipeService,
} from '@wagashi-backoffice/core';
import React from 'react';

interface RecipeEditorServices {
  createRecipeService: CreateRecipeService;
  updateRecipeService: UpdateRecipeService;
  deleteRecipeService: DeleteRecipeService;
  loadRecipesService: LoadRecipesService;
  loadIngredientsService: LoadIngredientsService;
  createIngredientService: CreateIngredientService;
}

const RecipeEditorServicesContext = React.createContext<undefined | RecipeEditorServices>(
  undefined
);

export const useRecipeEditorServices = () => {
  const values = React.useContext(RecipeEditorServicesContext);
  if (values === undefined) {
    throw new Error('Wrap your component with an RecipeEditorServicesProvider');
  }
  return values;
};

interface IRecipeEditorServiceProvider {
  value: RecipeEditorServices;
}

export const RecipeEditorServiceProvider: React.FC<IRecipeEditorServiceProvider> = ({
  children,
  value,
}) => {
  return (
    <RecipeEditorServicesContext.Provider
      value={React.useMemo(() => {
        return value;
      }, [])}
    >
      {children}
    </RecipeEditorServicesContext.Provider>
  );
};
