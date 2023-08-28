import * as React from 'react';
import {
  TabPanels
} from '@chakra-ui/react';
import { BOTTOMNAV_HEIGHT } from './BottomNav';
import { SectionProps } from './AppRouter';
import { APPBAR_HEIGHT } from '../../components/AppBar';

export function AppContent({...props}: SectionProps) {
  return (
    <TabPanels h={`calc(100vh - ${APPBAR_HEIGHT} - ${BOTTOMNAV_HEIGHT})`} overflowY="auto" {...props}>
      {props.tabs.map((tab, index) => {
        return (
          <tab.content key={index} />
        );
      })}
    </TabPanels>
  );
}