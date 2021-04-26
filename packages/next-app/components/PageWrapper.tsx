import {Box, Container, Heading} from '@chakra-ui/react';
import React from 'react';
import {Navbar} from './Navbar';

interface PageWrapperProps {
  title: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({title, children}) => {
  return (
    <Box>
      <Navbar />
      <Container maxW="container.xl" py={12}>
        <Heading>{title}</Heading>
        <Container maxW="container.xl" bg="pink.100" my={8} p={6} borderRadius="md" minHeight="container.sm">
          {children}
        </Container>
      </Container>
    </Box>
  );
};
