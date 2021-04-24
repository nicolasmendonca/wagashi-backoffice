import React from 'react';
import { Box, Spinner } from '@chakra-ui/react';

export const LoadingIndicator: React.FC = () => {
  return (
    <Box width="100vw" height="100vh" position="fixed" top="0" left="0">
      <Spinner size="xl" color="pink" thickness="6px" position="fixed" left="50%" top="50%" transform="translate(-50%, -50%)" />
    </Box>
  );
};
