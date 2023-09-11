import * as React from 'react';
import { TabPanel, TabPanelProps } from '@chakra-ui/react';
import { useAppContext } from '../../AppProvider';
import { UserHistory } from '../../components/UserHistory';

export function TabHistory({...props}: TabPanelProps) {
  const { wallet } = useAppContext();
  return (
    <TabPanel p="0" alignContent="center" {...props}>
      <UserHistory address={wallet?.address || ''} />
    </TabPanel>
  );
}
