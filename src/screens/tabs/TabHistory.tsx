import * as React from 'react';
import { TabPanel, TabPanelProps } from '@chakra-ui/react';
import { useAppContext } from '../../providers/AppProvider';
import { CONTENT_HEIGHT } from '../main/AppContent';
import { UserHistory } from '../../components/custom/UserHistory';

export function TabHistory({...props}: TabPanelProps) {
  const { wallet } = useAppContext();
  return (
    <TabPanel p="0" alignContent="center" {...props}>
      <UserHistory h={CONTENT_HEIGHT} address={wallet?.address || ''} />
    </TabPanel>
  );
}
