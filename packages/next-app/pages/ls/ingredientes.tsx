import React from 'react';
import Head from 'next/head';
import {PageWrapper} from '../../components/PageWrapper';
import {localStorageApiService} from '../../services/localStorage';
import {Ingredients} from '@wagashi-backoffice/ingredients-editor';
import {localStorageNavbarLinks} from '../../links/localStorageLinks';

interface IIngredientsProps {}

const IngredientsPage: React.FC<IIngredientsProps> = () => {
  return (
    <>
      <Head>
        <title>Ingredientes</title>
      </Head>
      <PageWrapper title="Ingredientes" navbarLinks={localStorageNavbarLinks}>
        <Ingredients
          deleteIngredientsService={localStorageApiService.deleteIngredientsService}
          loadIngredientsService={localStorageApiService.loadIngredientsService}
          updateIngredientService={localStorageApiService.updateIngredientService}
        />
      </PageWrapper>
    </>
  );
};

export default IngredientsPage;
