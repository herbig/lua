import * as React from 'react';
import {
  Box,
  BoxProps,
  TabPanelProps,
  Tabs
} from '@chakra-ui/react';
import { useAppContext } from '../AppProvider';
import { AppBar } from './AppBar';
import { AppContent } from './AppContent';
import { BottomNav } from './BottomNav';
import { Login } from './Login';
import { IconType } from 'react-icons';
import { FaCog, FaDollarSign, FaHistory } from 'react-icons/fa';
import { TabHistory } from '../tabs/TabHistory';
import { TabSend } from '../tabs/TabSend';
import { TabSettings } from '../tabs/TabSettings';

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
  },
  {
    content: TabSettings,
    tabIcon: FaCog
  }
];
  
export interface SectionProps extends BoxProps {
    tabs: AppTab[];
}
  
export function AppRouter() {
  const { key } = useAppContext();
  
  return (
    <Box w="100%" maxW="30rem">
      {key ?
        <Tabs flexDirection="column">
          <AppBar />
          <AppContent tabs={TABS} />
          <BottomNav tabs={TABS} />
        </Tabs> 
        : 
        <Login />
      }
    </Box>
  );
}