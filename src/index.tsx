import { ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import * as serviceWorker from './serviceWorker';
import { AppProvider } from './providers/AppProvider';
import { App } from './screens/main/App';
import { StrictMode } from 'react';
import { UIProvider } from './providers/UIProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorModeScript />
    <ChakraProvider theme={theme}>
      <AppProvider>
        <UIProvider>
          <App />
        </UIProvider>
      </AppProvider>
    </ChakraProvider>
  </StrictMode>
);

// an attempt to block / prevent the
// browser based pull to refresh
document.body.style.overflow = 'hidden';

// TODO this fails in production, investigate..
serviceWorker.register();

