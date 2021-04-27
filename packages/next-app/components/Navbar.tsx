import {Box, Flex, HStack, Link as ChakraLink, VisuallyHidden} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import NextLink, {LinkProps} from 'next/link';
import * as React from 'react';

interface DesktopNavLinkProps extends LinkProps {
  active?: boolean;
}

const DesktopNavLink: React.FC<DesktopNavLinkProps> = ({children, active, ...props}) => {
  return (
    <NextLink {...props}>
      <ChakraLink
        color={active ? 'gray.700' : 'white'}
        transition="all 0.2s ease-in-out"
        fontWeight={active ? 'bold' : 'semibold'}
        _hover={{
          color: 'gray.700',
        }}
      >
        {children}
      </ChakraLink>
    </NextLink>
  );
};

export const Navbar = () => {
  const {pathname} = useRouter();
  return (
    <Box as="header" boxShadow="md" bg="gray.500">
      <Box maxW="7xl" mx="auto" py="4" px={{base: '6', md: '8'}}>
        <Flex as="nav" justify="space-between">
          <HStack spacing="8">
            <Box as="a" href="#" rel="home">
              <VisuallyHidden>Wagashi</VisuallyHidden>
            </Box>
            <HStack spacing="8">
              <DesktopNavLink active={pathname === '/ls/recetas'} href="/ls/recetas">
                Recetas
              </DesktopNavLink>
              <DesktopNavLink href="/ls/ingredientes" active={pathname === '/ls/ingredientes'}>
                Ingredientes
              </DesktopNavLink>
              <DesktopNavLink href="/ls/calcular-ingredientes" active={pathname === '/ls/calcular-ingredientes'}>
                Calculadora de Ingredientes
              </DesktopNavLink>
            </HStack>
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};
