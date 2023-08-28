import * as React from 'react';
import {
  Tab,
  TabList,
  Divider,
  Box
} from '@chakra-ui/react';
import { SectionProps } from './AppRouter';

export const BOTTOMNAV_HEIGHT = '4rem';

export function BottomNav({...props}: SectionProps) {
  const tabWidth = (100 / props.tabs.length) + '%';
  return (
    <Box h={BOTTOMNAV_HEIGHT} {...props}>
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
    </Box>
  );
}