import * as React from 'react';
import {
  Button,
  Flex,
  TabPanel,
  TabPanelProps
} from '@chakra-ui/react';
import { NumberPad } from '../components/NumberPad';
import { useState } from 'react';
import { sendEth } from '../utils/sendEth';

export function TabSend({ ...props }: TabPanelProps) {
  const [amount, setAmount] = useState<number>(0);
  
  return (
    <TabPanel {...props} p="1rem" h="100%">
      <Flex flexDirection="column" h="100%">
        <NumberPad 
          flex="1"
          accountMax={9999} 
          onNumberChanged={(numPadAmount: number) => {
            setAmount(numPadAmount);
          }}
        />
        <Button mt="1rem" size="lg" colorScheme='blue' alignSelf="center" onClick={() => {
          // TODO
          sendEth('0x8E2695650D09FD940516d6e050D0Ba87d8deF032', amount);
        }}>Send</Button>
      </Flex>
    </TabPanel>
  );
}