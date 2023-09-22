import { TabPanelProps, TabPanel } from '@chakra-ui/react';
import * as React from 'react';
import { HistoryDataList } from '../../components/custom/HistoryDataList';
import { useUser } from '../../providers/UserProvider';


export function TabHistory({...props}: TabPanelProps) {
  const { wallet } = useUser();
  return (
    <TabPanel p="0" {...props}>
      <HistoryDataList 
        userAddress={wallet!.address} 
        refreshIntervalSeconds={10} />
    </TabPanel>
  );
}