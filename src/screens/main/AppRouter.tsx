import * as React from 'react';
import {
  Box,
  BoxProps,
  TabPanelProps,
  Tabs
} from '@chakra-ui/react';
import { useAppContext } from '../../AppProvider';
import { MainAppBar } from './MainAppBar';
import { AppContent } from './AppContent';
import { BottomNav } from './BottomNav';
import { Login } from '../Login';
import { IconType } from 'react-icons';
import { FaDollarSign, FaHistory } from 'react-icons/fa';
import { TabHistory } from '../tabs/TabHistory';
import { TabSend } from '../tabs/TabSend';
import { useState } from 'react';
import { ProgressModal } from '../../components/modals/ProgressModal';
import { SettingsModal } from '../../components/modals/SettingsModal';

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
 * The list of tabs displayed in the app.  Future tabs
 * can be easily added simply by placing their icon and
 * content here, and it will appear.
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
 * Props used to supply the list of tabs to both the main content
 * and the bottom nav.
 */
export interface SectionProps extends BoxProps {
  tabs: AppTab[];
}

/**
 * The top level component of the app.
 * 
 * This manages displaying the login screen if the user is not
 * logged in, as well as the main content and tabs if they are.
 * 
 * TODO Settings is also shown / hidden here, although it's not a great
 * place to be doing that, so it would be great to come up with a
 * better system for that.
 */
export function AppRouter() {
  const { wallet, progressMessage } = useAppContext();
  const [showSettings, setShowSettings] = useState<boolean>(false);

  return (
    <Box w="100%" maxW={APP_MAX_W} position="relative">

      {/* Show the main content if you're logged in, otherwise the login screen. */}
      {wallet ?
        <Tabs w="100%" position="absolute" flexDirection="column">
          <MainAppBar
            onSettingsClicked={() => {
              setShowSettings(true);
            }} />
          <AppContent tabs={TABS} />
          <BottomNav tabs={TABS} />
        </Tabs> 
        : 
        <Login />
      }

      {/* 
      The settings screen, which is a full screen modal.
      This can't be physically accessed if you're not logged in.
      */}
      <SettingsModal 
        onClose={() => {setShowSettings(false);}}
        isOpen={showSettings} />

      {/* 
      The generic progress message, which can be shown 
      from anywhere via the useAppContext hook.
      */}
      <ProgressModal message={progressMessage} />
    </Box>
  );
}