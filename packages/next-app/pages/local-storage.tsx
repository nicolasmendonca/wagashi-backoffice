import React from 'react'
import Head from 'next/head'
import { RecipeEditor, RecipeEditorServiceProvider} from '@wagashi-backoffice/recipe-editor'
import { buildCreateIngredientService, buildCreateRecipeService, buildDeleteRecipeService, buildLoadIngredientsService, buildLoadRecipesService, buildUpdateRecipeService } from '../services'
import { recipesLocalStorageRepository, ingredientsLocalStorageRepository } from '../repositories/localStorage'

interface IRecipeEditorPageProps {}

const RecipeEditorPage: React.FC<IRecipeEditorPageProps> = () => {
  return (
    <>
    <Head>
      <title>Recetas</title>
    </Head>
    <RecipeEditorServiceProvider value={{
      createRecipeService: buildCreateRecipeService(recipesLocalStorageRepository),
      loadRecipesService: buildLoadRecipesService(recipesLocalStorageRepository),
      updateRecipeService: buildUpdateRecipeService(recipesLocalStorageRepository),
      deleteRecipeService: buildDeleteRecipeService(recipesLocalStorageRepository),
      createIngredientService: buildCreateIngredientService(ingredientsLocalStorageRepository),
      loadIngredientsService: buildLoadIngredientsService(ingredientsLocalStorageRepository),
    }}>
      <RecipeEditor />
    </RecipeEditorServiceProvider>
    </>
  )
}

export default RecipeEditorPage
