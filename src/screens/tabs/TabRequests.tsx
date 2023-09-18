import * as React from 'react';
import { TabPanel, TabPanelProps } from '@chakra-ui/react';
import { CONTENT_HEIGHT } from '../main/AppContent';
import { Requests } from '../../components/custom/Requests';

export function TabRequests({...props}: TabPanelProps) {
  return (
    <TabPanel p="0" alignContent="center" {...props}>
      <Requests h={CONTENT_HEIGHT} />
    </TabPanel>
  );
}
