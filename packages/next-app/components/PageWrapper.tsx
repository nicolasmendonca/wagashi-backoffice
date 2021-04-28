import {Box, Container, Heading} from '@chakra-ui/react';
import React from 'react';
import {Navbar, Link} from './Navbar';

interface PageWrapperProps {
  title: string;
  navbarLinks: Link[];
}

export const PageWrapper: React.FC<PageWrapperProps> = ({title, children, navbarLinks}) => {
  return (
    <Box bgColor="teal.400" minHeight="100vh">
      <Navbar links={navbarLinks} />
      <Container maxW="container.xl" py={12}>
        <Heading>{title}</Heading>
        <Container maxW="container.xl" bg="gray.200" my={8} p={6} borderRadius="md" minHeight="container.sm">
          {children}
        </Container>
      </Container>
    </Box>
  );
};
