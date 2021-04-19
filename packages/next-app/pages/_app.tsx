import {ChakraProvider} from '@chakra-ui/react';
import React from 'react';
import {theme} from 'theme';
import {AppContextProvider} from '../context/App';

function MyApp({Component, pageProps}) {
  return (
    <AppContextProvider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </AppContextProvider>
  );
}

export default MyApp;
