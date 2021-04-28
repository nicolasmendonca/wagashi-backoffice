import React from 'react';
import Head from 'next/head';
import {RecipeEditor} from '@wagashi-backoffice/recipe-editor';
import {backendApiServices} from '../../services/backendApi';
import {PageWrapper} from '../../components/PageWrapper';
import {backendApiNavbarLinks} from '../../links/backendApiLinks';

interface IRecipeEditorPageProps {}

const RecipeEditorPage: React.FC<IRecipeEditorPageProps> = () => {
  return (
    <>
      <Head>
        <title>Recetas</title>
      </Head>
      <PageWrapper title="Recetas" navbarLinks={backendApiNavbarLinks}>
        <RecipeEditor services={backendApiServices} />
      </PageWrapper>
    </>
  );
};

export default RecipeEditorPage;
