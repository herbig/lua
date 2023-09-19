import * as React from 'react';
import { Tab, TabList, Divider, Box } from '@chakra-ui/react';
import { AppTab } from './App';

export const BOTTOMNAV_HEIGHT = '3.3rem';

/**
 * The bottom navigation for the main app content, which
 * displays the tab icons to switch between the tabs.
 */
export function BottomNav({tabs}: {tabs: AppTab[]}) {
  return (
    <Box>
      <Divider />
      <TabList h={BOTTOMNAV_HEIGHT}>
        {tabs.map((tab, index) => {
          return (
            <Tab 
              key={index}
              w={(100 / tabs.length) + '%'}
              h='full'>
              {<tab.tabIcon />}
            </Tab>
          );
        })}
      </TabList>
    </Box>
  );
}