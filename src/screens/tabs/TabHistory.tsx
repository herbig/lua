import { TabPanelProps, TabPanel } from '@chakra-ui/react';
import * as React from 'react';
import { HistoryDataList } from '../../components/custom/HistoryDataList';
import { useAppContext } from '../../providers/AppProvider';


export function TabHistory({...props}: TabPanelProps) {
  const { wallet } = useAppContext();
  return (
    <TabPanel p="0" alignContent="center" {...props}>
      <HistoryDataList 
        userAddress={wallet!.address} 
        refreshIntervalSeconds={10} />
    </TabPanel>
  );
}