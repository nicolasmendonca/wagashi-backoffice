import React from 'react';
import Head from 'next/head';
import {RecipeEditor} from '@wagashi-backoffice/recipe-editor';
import {localStorageApiService} from '../../services/localStorage';
import {PageWrapper} from '../../components/PageWrapper';

interface IRecipeEditorPageProps {}

const RecipeEditorPage: React.FC<IRecipeEditorPageProps> = () => {
  return (
    <>
      <Head>
        <title>Recetas</title>
      </Head>
      <PageWrapper title="Recetas">
        <RecipeEditor services={localStorageApiService} />
      </PageWrapper>
    </>
  );
};

export default RecipeEditorPage;
