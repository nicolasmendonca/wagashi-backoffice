import React from 'react';
import Head from 'next/head';
import {RecipeEditor} from '@wagashi-backoffice/recipe-editor';
import {
  buildCreateIngredientService,
  buildCreateRecipeService,
  buildDeleteRecipeService,
  buildLoadIngredientsService,
  buildLoadRecipesService,
  buildUpdateRecipeService,
} from '../services/localStorage';
import {recipesLocalStorageRepository, ingredientsLocalStorageRepository} from '../repositories/localStorage';
import {PageWrapper} from '../components/PageWrapper';

interface IRecipeEditorPageProps {}

const RecipeEditorPage: React.FC<IRecipeEditorPageProps> = () => {
  return (
    <>
      <Head>
        <title>Recetas</title>
      </Head>
      <PageWrapper title="Recetas">
        <RecipeEditor
          services={{
            createRecipeService: buildCreateRecipeService(recipesLocalStorageRepository),
            loadRecipesService: buildLoadRecipesService(recipesLocalStorageRepository),
            updateRecipeService: buildUpdateRecipeService(recipesLocalStorageRepository),
            deleteRecipeService: buildDeleteRecipeService(recipesLocalStorageRepository),
            createIngredientService: buildCreateIngredientService(ingredientsLocalStorageRepository),
            loadIngredientsService: buildLoadIngredientsService(ingredientsLocalStorageRepository),
          }}
        />
      </PageWrapper>
    </>
  );
};

export default RecipeEditorPage;
