import * as React from 'react';
import {
  ChakraProvider,
  theme,
  Center
} from '@chakra-ui/react';
import { AppProvider } from './AppProvider';
import { AppRouter } from './screens/main/AppRouter';

// adding state history to allow for hijacking the
// Android back button.  See useBackButton.
window.onload = () => {
  window.history.pushState({}, '');
};

export const App = () => (
  <ChakraProvider theme={theme}>
    <AppProvider>
      <Center>
        <AppRouter />
      </Center>
    </AppProvider>
  </ChakraProvider>
);
