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

export const APP_MAX_W = '30rem';

export type AppTab = {
    tabIcon: IconType;
    content: (props: TabPanelProps) => JSX.Element;
  };
  
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
  
export interface SectionProps extends BoxProps {
    tabs: AppTab[];
}
  
export function AppRouter() {
  const { wallet, progressMessage } = useAppContext();
  const [showSettings, setShowSettings] = useState<boolean>(false);

  return (
    <Box w="100%" maxW={APP_MAX_W} position="relative">
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
      <SettingsModal 
        onClose={() => {setShowSettings(false);}}
        shown={showSettings} /> 
      <ProgressModal message={progressMessage} />
    </Box>
  );
}