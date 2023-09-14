import { ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import * as serviceWorker from './serviceWorker';
import { AppProvider } from './providers/AppProvider';
import { App } from './screens/main/App';

// adding state history to allow for hijacking the
// Android back button.  See useBackButton.
window.onload = () => {
  window.history.pushState({}, '');
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeScript />
    <ChakraProvider theme={theme}>
      <AppProvider>
        <App />
      </AppProvider>
    </ChakraProvider>
  </React.StrictMode>
);

serviceWorker.register();

