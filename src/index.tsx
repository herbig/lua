import { Center, ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import * as serviceWorker from './serviceWorker';
import { AppProvider } from './AppProvider';
import { AppRouter } from './screens/main/AppRouter';

// adding state history to allow for hijacking the
// Android back button.  See useBackButton.
window.onload = () => {
  window.history.pushState({}, '');
};

const App = () => (
  <ChakraProvider theme={theme}>
    <AppProvider>
      <Center>
        <AppRouter />
      </Center>
    </AppProvider>
  </ChakraProvider>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeScript />
    <App />
  </React.StrictMode>
);
serviceWorker.register();

