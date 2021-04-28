import React from 'react';
import {GetServerSideProps} from 'next';

interface IIndexProps {}

const Index: React.FC<IIndexProps> = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
    redirect: {
      destination: '/ls/recetas',
    },
  };
};

export default Index;
