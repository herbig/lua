import * as React from 'react';
import {
  Text,
  Button,
  Center,
  TabPanel,
  TabPanelProps,
  VStack
} from '@chakra-ui/react';
import { MIN_SELL, RampModal } from '../../components/modals/RampModal';
import { useState } from 'react';
import { useAppContext } from '../../AppProvider';
import { APP_DEFAULT_H_PAD } from '../main/AppRouter';

export function TabRamp({...props}: TabPanelProps) {

  // TODO make this prettier

  const { ethBalance } = useAppContext();

  const [ showBuy, setShowBuy ] = useState(false);
  const [ showSell, setShowSell ] = useState(false);

  return (
    <TabPanel ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD} h="100%" {...props}>
      <Center h='100%'>
        <VStack>
          <Text as='b' mb='3rem'>This tab is in progress, but should work...</Text>
          <Button colorScheme='blue' onClick={() => {
            setShowBuy(true);
          }}>Deposit</Button>
          {Number(ethBalance) >= MIN_SELL ? <Button mt='3rem' colorScheme='blue' onClick={() => {
            setShowSell(true);
          }}>Withdraw</Button> : null}
        </VStack>
      </Center>
      <RampModal type={'buy'} isOpen={showBuy} onClose={() => {
        setShowBuy(false);
      }} />
      <RampModal type={'sell'} isOpen={showSell} onClose={() => {
        setShowSell(false);
      }} />
    </TabPanel>
  );
}