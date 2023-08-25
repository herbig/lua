import * as React from 'react';
import {
  Button,
  Flex,
  TabPanel,
  TabPanelProps
} from '@chakra-ui/react';
import { NumberPad } from '../../components/NumberPad';
import { useState } from 'react';
import { UserSearch } from '../UserSearch';

export function TabSend({...props}: TabPanelProps) {
  const [amount, setAmount] = useState<number>(0);
  const [searching, setSearching] = useState<boolean>(false);
  
  return (
    <TabPanel p="1rem" h="100%" {...props}>
      {searching ?
        <UserSearch />
        :
        <Flex flexDirection="column" h="100%">
          <NumberPad 
            flex="1"
            accountMax={9999} 
            onNumberChanged={(numPadAmount: number) => {
              setAmount(numPadAmount);
            }}
          />
          <Button mt="1rem" size="lg" colorScheme='blue' alignSelf="center" onClick={() => {
            setSearching(true);
          }}>Send</Button>
        </Flex>
      }
    </TabPanel>
  );
}