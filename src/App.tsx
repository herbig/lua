import * as React from 'react'
import {
  ChakraProvider,
  theme,
  Tabs,
  BoxProps,
  Center,
  TabPanelProps,
} from '@chakra-ui/react'
import { AppBar } from './base/AppBar'
import { BottomNav } from './base/BottomNav'
import { AppContent } from './base/AppContent'
import { IconType } from 'react-icons'
import { FaDollarSign, FaHistory } from 'react-icons/fa'
import { TabSend } from './tabs/TabSend'
import { TabHistory } from './tabs/TabHistory'

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
];

export interface SectionProps extends BoxProps {
  tabs: AppTab[];
}

export const App = () => (
  <ChakraProvider theme={theme}>
    <Center>
      <Tabs w="100%" maxW="30rem" flexDirection="column">
        <AppBar />
        <AppContent tabs={TABS} />
        <BottomNav tabs={TABS} />
      </Tabs>
    </Center>
  </ChakraProvider>
)
