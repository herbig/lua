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
import { Settings } from '../Settings';
import { QRCodeScanner } from '../QRCodeScanner';
import { ProgressModal } from '../../components/modals/ProgressModal';

/** The default horizontal padding for every content screen in the app. */
export const APP_DEFAULT_H_PAD = '1rem';

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

  // TODO this system leaves these showing when you log out
  // definitely need a better way to show fullscreen overlays
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);

  return (
    <Box w="100%" maxW="30rem" position="relative">
      {wallet ?
        <Tabs w="100%" position="absolute" flexDirection="column">
          <MainAppBar 
            onScanClicked={() => {
              setShowQrCode(true);
            }}
            onSettingsClicked={() => {
              setShowSettings(true);
            }} />
          <AppContent tabs={TABS} />
          <BottomNav tabs={TABS} />
        </Tabs> 
        : 
        <Login />
      }
      {showQrCode ? 
        <QRCodeScanner onBackClicked={() => {
          setShowQrCode(false);
        }} /> 
        : 
        null
      }
      {showSettings ? 
        <Settings onBackClicked={() => {
          setShowSettings(false);
        }} /> 
        : 
        null
      }
      <ProgressModal message={progressMessage} />
    </Box>
  );
}