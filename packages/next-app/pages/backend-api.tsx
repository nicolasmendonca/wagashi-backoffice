import React from 'react'
import Head from 'next/head'
import { RecipeEditor, RecipeEditorServiceProvider} from '@wagashi-backoffice/recipe-editor'
import { buildCreateIngredientService, buildCreateRecipeService, buildLoadIngredientsService, buildLoadRecipesService } from '../services/backendApi'
import { recipesBackendApiRepository } from '../repositories/backendApi'

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
      createIngredientService: buildCreateIngredientService(ingredientsLocalStorageRepository),
      loadIngredientsService: buildLoadIngredientsService(ingredientsLocalStorageRepository),
    }}>
      <RecipeEditor />
    </RecipeEditorServiceProvider>
    </>
  )
}

export default RecipeEditorPage
