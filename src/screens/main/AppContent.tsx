import * as React from 'react';
import {
  TabPanels
} from '@chakra-ui/react';
import { BOTTOMNAV_HEIGHT } from './BottomNav';
import { SectionProps } from './AppRouter';
import { APPBAR_HEIGHT } from '../../components/base/AppBar';

export const CONTENT_HEIGHT = `calc(100vh - ${APPBAR_HEIGHT} - ${BOTTOMNAV_HEIGHT})`;

/**
 * The main app content, which takes the full vertical height of the screen
 * between the AppBar and the bottom tabs.
 * 
 * This is designed to handle showing multiple tabs, which will all
 * be rendered when the app loads, but shown / hidden by the interaction
 * between the Chakra TabPanels and TabList components.
 */
export function AppContent({...props}: SectionProps) {
  return (
    <TabPanels h={CONTENT_HEIGHT} overflowY="auto" {...props}>
      {props.tabs.map((tab, index) => {
        return (
          <tab.content key={index} />
        );
      })}
    </TabPanels>
  );
}