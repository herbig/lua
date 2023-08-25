import * as React from 'react';
import {
  TabPanels
} from '@chakra-ui/react';
import { APPBAR_HEIGHT } from './AppBar';
import { BOTTOMNAV_HEIGHT } from './BottomNav';
import { SectionProps } from './AppRouter';

export function AppContent({ ...props }: SectionProps) {
  return (
    <TabPanels {...props} h={`calc(100vh - ${APPBAR_HEIGHT} - ${BOTTOMNAV_HEIGHT})`} overflowY="auto">
      {props.tabs.map((tab, index) => {
        return (
          <tab.content key={index} />
        );
      })}
    </TabPanels>
  );
}