import {Container, Heading } from '@chakra-ui/react';
import React from 'react';

interface PageWrapperProps {
  title: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ title, children }) => {
  return (
      <Container maxW="container.xl" py={12}>
        <Heading>{title}</Heading>
        <Container maxW="container.xl" bg="pink.100" my={8} p={6} borderRadius="md">
          {children}
        </Container>
      </Container>
  );
};
