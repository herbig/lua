import * as React from 'react';
import {
  Tab,
  TabList,
  Divider,
  Flex
} from '@chakra-ui/react';
import { AppTab } from './App';

export const BOTTOMNAV_HEIGHT = '3.5rem';

/**
 * The bottom navigation for the main app content, which
 * displays the tab icons to switch between the tabs.
 */
export function BottomNav({tabs}: {tabs: AppTab[]}) {
  const tabWidth = (100 / tabs.length) + '%';
  return (
    <Flex flexDirection='column' h={BOTTOMNAV_HEIGHT}>
      <Divider />
      <TabList h='full'>
        {tabs.map((tab, index) => {
          return (
            <Tab 
              key={index}
              w={tabWidth} 
              h='full'>
              {<tab.tabIcon />}
            </Tab>
          );
        })}
      </TabList>
    </Flex>
  );
}