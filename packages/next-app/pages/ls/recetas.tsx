import React from 'react';
import Head from 'next/head';
import {RecipeEditor} from '@wagashi-backoffice/recipe-editor';
import {localStorageApiService} from '../../services/localStorage';
import {PageWrapper} from '../../components/PageWrapper';
import {localStorageNavbarLinks} from '../../links/localStorageLinks';

interface IRecipeEditorPageProps {}

const RecipeEditorPage: React.FC<IRecipeEditorPageProps> = () => {
  return (
    <>
      <Head>
        <title>Recetas</title>
      </Head>
      <PageWrapper title="Recetas" navbarLinks={localStorageNavbarLinks}>
        <RecipeEditor services={localStorageApiService} />
      </PageWrapper>
    </>
  );
};

export default RecipeEditorPage;
