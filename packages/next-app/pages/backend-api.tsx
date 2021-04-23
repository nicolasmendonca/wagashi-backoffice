import React from 'react'
import Head from 'next/head'
import { RecipeEditor, RecipeEditorServiceProvider} from '@wagashi-backoffice/recipe-editor'
import { buildCreateIngredientService, buildCreateRecipeService, buildDeleteRecipeService, buildLoadIngredientsService, buildLoadRecipesService, buildUpdateRecipeService } from '../services/backendApi'
import { ingredientsBackendApiRepository, recipesBackendApiRepository } from '../repositories/backendApi'

interface IRecipeEditorPageProps {}

const RecipeEditorPage: React.FC<IRecipeEditorPageProps> = () => {
  return (
    <>
    <Head>
      <title>Recetas</title>
    </Head>
    <RecipeEditorServiceProvider value={{
      createRecipeService: buildCreateRecipeService(recipesBackendApiRepository),
      loadRecipesService: buildLoadRecipesService(recipesBackendApiRepository),
      createIngredientService: buildCreateIngredientService(ingredientsBackendApiRepository),
      loadIngredientsService: buildLoadIngredientsService(ingredientsBackendApiRepository),
      updateRecipeService: buildUpdateRecipeService(recipesBackendApiRepository),
      deleteRecipeService: buildDeleteRecipeService(recipesBackendApiRepository)
    }}>
      <RecipeEditor />
    </RecipeEditorServiceProvider>
    </>
  )
}

export default RecipeEditorPage
