import React from 'react';
import Head from 'next/head';
import {PageWrapper} from '../../components/PageWrapper';
import {backendApiServices} from '../../services/backendApi';
import {IngredientsCalculator} from '@wagashi-backoffice/ingredients-calculator';
import {backendApiNavbarLinks} from '../../links/backendApiLinks';

interface IRecipeEditorPageProps {}

const RecipeEditorPage: React.FC<IRecipeEditorPageProps> = () => {
  return (
    <>
      <Head>
        <title>Calcular Ingredientes</title>
      </Head>
      <PageWrapper title="Calcular ingredientes" navbarLinks={backendApiNavbarLinks}>
        <IngredientsCalculator loadRecipesService={backendApiServices.loadRecipesService} loadIngredientsService={backendApiServices.loadIngredientsService} />
      </PageWrapper>
    </>
  );
};

export default RecipeEditorPage;
