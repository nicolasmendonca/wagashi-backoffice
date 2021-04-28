import React from 'react';
import Head from 'next/head';
import {PageWrapper} from '../../components/PageWrapper';
import {Ingredients} from '@wagashi-backoffice/ingredients-editor';
import {backendApiServices} from '../../services/backendApi';
import {backendApiNavbarLinks} from '../../links/backendApiLinks';

interface IIngredientsProps {}

const IngredientsPage: React.FC<IIngredientsProps> = () => {
  return (
    <>
      <Head>
        <title>Ingredientes</title>
      </Head>
      <PageWrapper title="Ingredientes" navbarLinks={backendApiNavbarLinks}>
        <Ingredients
          deleteIngredientsService={backendApiServices.deleteIngredientsService}
          loadIngredientsService={backendApiServices.loadIngredientsService}
          updateIngredientService={backendApiServices.updateIngredientService}
        />
      </PageWrapper>
    </>
  );
};

export default IngredientsPage;
