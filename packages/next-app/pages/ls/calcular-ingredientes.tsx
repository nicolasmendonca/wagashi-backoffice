import React from 'react';
import Head from 'next/head';
import {PageWrapper} from '../../components/PageWrapper';
import {localStorageApiService} from '../../services/localStorage';
import {IngredientsCalculator} from '@wagashi-backoffice/ingredients-calculator';

interface IRecipeEditorPageProps {}

const RecipeEditorPage: React.FC<IRecipeEditorPageProps> = () => {
  return (
    <>
      <Head>
        <title>Calcular Ingredientes</title>
      </Head>
      <PageWrapper title="Calcular ingredientes">
        <IngredientsCalculator
          loadRecipesService={localStorageApiService.loadRecipesService}
          loadIngredientsService={localStorageApiService.loadIngredientsService}
        />
      </PageWrapper>
    </>
  );
};

export default RecipeEditorPage;
