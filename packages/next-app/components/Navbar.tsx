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

export interface Link {
  name: string;
  pathname: string;
}

interface INavbarProps {
  links: Link[];
}

export const Navbar: React.FC<INavbarProps> = ({links}) => {
  const {pathname} = useRouter();
  return (
    <Box as="header" boxShadow="md" bg="pink.400">
      <Box maxW="7xl" mx="auto" py="4" px={{base: '6', md: '8'}}>
        <Flex as="nav" justify="space-between">
          <HStack>
            <Box as="a" href="#" rel="home">
              <VisuallyHidden>Wagashi</VisuallyHidden>
            </Box>
            <HStack spacing="8">
              {links.map((link) => (
                <DesktopNavLink key={link.pathname} active={pathname === link.pathname} href={link.pathname}>
                  {link.name}
                </DesktopNavLink>
              ))}
            </HStack>
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};
