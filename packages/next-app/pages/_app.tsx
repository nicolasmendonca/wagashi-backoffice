import {ChakraProvider, theme} from '@chakra-ui/react';
import React from 'react';

function MyApp({Component, pageProps}) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
