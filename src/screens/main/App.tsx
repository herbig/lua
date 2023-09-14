import * as React from 'react';
import {
  Box,
  Center,
  TabPanelProps,
  Tabs
} from '@chakra-ui/react';
import { useAppContext } from '../../providers/AppProvider';
import { MainAppBar } from './MainAppBar';
import { AppContent } from './AppContent';
import { BottomNav } from './BottomNav';
import { Login } from '../custom/Login';
import { IconType } from 'react-icons';
import { FaDollarSign, FaHistory } from 'react-icons/fa';
import { TabHistory } from '../tabs/TabHistory';
import { TabSend } from '../tabs/TabSend';
import { ChooseName } from '../custom/ChooseName';
import { useAddressToUsername } from '../../utils/users';
import { ProgressModal } from '../../components/modals/base/ProgressModal';
import { InstallPromptModal } from '../../components/modals/custom/InstallPromptModal';

/** The default horizontal padding for every content screen in the app. */
export const APP_DEFAULT_H_PAD = '1.25rem';

/**
 * The maximum width of the app, to allow for its use on
 * non-mobile screens.  This is intentionally larger than
 * any mobile devices in portrait mode, aside from tablets.
 */
export const APP_MAX_W = '30rem';

/** A tab in the app. */
export type AppTab = {
  tabIcon: IconType;
  content: (props: TabPanelProps) => JSX.Element;
};

/**
 * The list of tabs displayed in the app.  Tabs can be 
 * easily added simply by placing their icon and content 
 * here, and it will appear.
 */
const TABS: AppTab[] = [
  {
    content: TabSend,
    tabIcon: FaDollarSign
  },
  {
    content: TabHistory,
    tabIcon: FaHistory
  }
];

/**
 * The top level component of the app.
 * 
 * This manages displaying the login screen if the user is not
 * logged in, as well as the main content and tabs if they are.
 */
export function App() {
  const { wallet, progressMessage, ethBalance } = useAppContext();
  const { username } = useAddressToUsername(wallet?.address);

  const loggedOut = !wallet;
  const canSetUsername = username === null && Number(ethBalance) >= 0.01;

  return (
    <Center>
      <Box w="full" maxW={APP_MAX_W} userSelect='none'>
        {
          loggedOut ?
            <Login />
            : canSetUsername ?
              <ChooseName />
              :
              <Tabs>
                <MainAppBar />
                <AppContent tabs={TABS} />
                <BottomNav tabs={TABS} />
              </Tabs>
        }
        {/* 
          Generic progress message, which can be shown from
          anywhere via the useAppContext hook.
        */}
        <ProgressModal message={progressMessage} />

        {/* Modal that handles prompting the user to install the app. */}
        <InstallPromptModal />
      </Box>
    </Center>
  );
}