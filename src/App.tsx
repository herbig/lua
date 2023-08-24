import * as React from 'react';
import {
  ChakraProvider,
  theme,
  Center
} from '@chakra-ui/react';
import { AppProvider } from './AppProvider';
import { AppRouter } from './base/AppRouter';

export const App = () => (
  <ChakraProvider theme={theme}>
    <AppProvider>
      <Center>
        <AppRouter />
      </Center>
    </AppProvider>
  </ChakraProvider>
);
