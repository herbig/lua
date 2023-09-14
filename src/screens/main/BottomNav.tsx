import * as React from 'react';
import {
  Tab,
  TabList,
  Divider,
  Flex
} from '@chakra-ui/react';
import { SectionProps } from './AppRouter';

export const BOTTOMNAV_HEIGHT = '3.5rem';

/**
 * The bottom navigation for the main app content, which
 * displays the tab icons to switch between the tabs.
 */
export function BottomNav({...props}: SectionProps) {
  const tabWidth = (100 / props.tabs.length) + '%';
  return (
    <Flex flexDirection='column' h={BOTTOMNAV_HEIGHT} {...props}>
      <Divider />
      <TabList w="100%" h="100%">
        {props.tabs.map((tab, index) => {
          return (
            <Tab 
              key={index}
              w={tabWidth} h="100%">
              {<tab.tabIcon />}
            </Tab>
          );
        })}
      </TabList>
    </Flex>
  );
}