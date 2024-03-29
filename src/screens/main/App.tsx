import * as React from 'react';
import {
  Box,
  Center,
  TabPanelProps,
  Tabs
} from '@chakra-ui/react';
import { useUser } from '../../providers/UserProvider';
import { MainAppBar } from './MainAppBar';
import { AppContent } from './AppContent';
import { BottomNav } from './BottomNav';
import { Login } from '../custom/Login';
import { IconType } from 'react-icons';
import { FaDollarSign, FaHistory, FaReceipt } from 'react-icons/fa';
import { TabHistory } from '../tabs/TabHistory';
import { TabSend } from '../tabs/TabSend';
import { ChooseName } from '../custom/ChooseName';
import { useAddressToUsername } from '../../utils/contracts/usernames';
import { ProgressModal } from '../../components/modals/base/ProgressModal';
import { TabRequests } from '../tabs/TabRequests';
import { useState } from 'react';
import { Faucet } from '../custom/Faucet';
import { useFaucet, workableEth } from '../../utils/eth';
import { InstallPromptBlocker } from '../custom/InstallPromptBlocker';
import { useUI } from '../../providers/UIProvider';

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
  title: string;
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
    title: 'Transfer',
    content: TabSend,
    tabIcon: FaDollarSign
  },
  {
    title: 'History',
    content: TabHistory,
    tabIcon: FaHistory
  },
  {
    title: 'Requests',
    content: TabRequests,
    tabIcon: FaReceipt
  }
];

/**
 * The top level component of the app.
 * 
 * This manages displaying the login screen if the user is not
 * logged in, as well as the main content and tabs if they are.
 */
export function App() {
  const { wallet, ethBalance } = useUser();
  const { progressMessage, currentModal } = useUI();
  const { username } = useAddressToUsername(wallet?.address);

  const loggedOut = !wallet;
  const canSetUsername = username === null && workableEth(ethBalance) >= 0.01;

  const [ appBarTitle, setAppBarTitle ] = useState<string>(TABS[0].title);

  const { allowFaucet } = useFaucet();

  // TODO disabling the PWA install prompt, as showcasing the app
  // with it makes the whole thing seem suspicious, most folks don't
  // yet know what a PWA app is
  const showInstallPrompt = false; // !isPWA() && process.env.NODE_ENV !== 'development';

  return (
    <Center>
      <Box w="full" maxW={APP_MAX_W} userSelect='none'>
        { showInstallPrompt ?
          <InstallPromptBlocker />
          : loggedOut ?
            <Login />
            : allowFaucet ?
              <Faucet />
              : canSetUsername ?
                <ChooseName />
                :
                <Tabs onChange={(index) => setAppBarTitle(TABS[index].title)}>
                  <MainAppBar title={appBarTitle} />
                  <AppContent tabs={TABS} />
                  <BottomNav tabs={TABS} />
                </Tabs>
        }

        {currentModal}

        {/* 
          Generic progress message, which can be shown from
          anywhere via the useAppContext hook.
        */}
        <ProgressModal message={progressMessage} />

        {/* Modal that handles prompting the user to install the app. */}
        {/* TODO removed for now cause it's kinda janky */}
        {/* <InstallPromptModal /> */}
      </Box>
    </Center>
  );
}