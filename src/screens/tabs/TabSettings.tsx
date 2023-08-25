import * as React from 'react';
import { TabPanelProps, TabPanel, Button, Divider } from '@chakra-ui/react';
import { useAppContext } from '../../AppProvider';
import { ColorModeSwitcher } from '../../components/ColorModeSwitcher';

export function TabSettings({ ...props }: TabPanelProps) {
  const { setUser } = useAppContext();
  
  return (
    <TabPanel {...props}>
      <Button onClick={() => {
        setUser(undefined);
      }}>
        Log Out
      </Button>
      <Divider mt="1rem" mb="1rem" />
      <ColorModeSwitcher />
    </TabPanel>
  );
}