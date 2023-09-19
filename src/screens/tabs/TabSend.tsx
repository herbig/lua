import * as React from 'react';
import {
  Button,
  Flex,
  TabPanel,
  TabPanelProps
} from '@chakra-ui/react';
import { useState } from 'react';
import { ConfirmSendModal, ConfirmType } from '../overlays/ConfirmSendModal';
import { APP_DEFAULT_H_PAD } from '../main/App';
import { useAppContext } from '../../providers/AppProvider';
import { workableEth } from '../../utils/eth';
import { EthAddressSelector } from '../../components/custom/EthAddressSelector';
import { NumberPad } from '../../components/custom/NumberPad';

export function TabSend({...props}: TabPanelProps) {
  // maximum amount able to be sent, truncated to the nearest 'cent'
  const { ethBalance } = useAppContext();
  const maxSend = workableEth(ethBalance);

  // the amount set via the number pad
  const [amount, setAmount] = useState<number>(0);
    
  // used to reset the address input after sending
  const [recipient, setRecipient] = useState<string>('');

  // holds the validated address or username, or undefined if the input isn't valid
  const [address, setAddress] = useState<string>();

  // takes the type of confirm to show: request or send, or undefined to hide it
  const [confirmType, setConfirmType] = useState<ConfirmType>();

  const requestDisabled = !address || amount == 0 || maxSend == 0; // disabled if they have no Eth
  const payDisabled = !address || amount == 0 || amount > maxSend;

  return (
    <TabPanel pt="1rem" pb="1rem" ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD} h="100%" {...props}>
      <Flex flexDirection="column" h="100%">
        <EthAddressSelector 
          value={recipient}
          setValue={setRecipient}
          onAddressValidation={setAddress} />
        <NumberPad 
          flex="1"
          accountMax={maxSend}
          amount={amount}
          setAmount={setAmount}
        />
        <Flex mt="1rem">
          <Button
            w='50%'
            me='0.5rem'
            isDisabled={requestDisabled} 
            borderRadius='2rem'
            size="lg"
            colorScheme='blue' 
            alignSelf="center" 
            onClick={() => {
              setConfirmType('request');
            }}>
          Request
          </Button>
          <Button 
            w='50%'
            ms='0.5rem'
            isDisabled={payDisabled} 
            borderRadius='2rem'
            size="lg"
            colorScheme='blue' 
            alignSelf="center" 
            onClick={() => {
              setConfirmType('send');
            }}>
          Pay
          </Button>
        </Flex>
      </Flex>
      
      {!!confirmType && 
        <ConfirmSendModal
          isOpen={!!confirmType}
          type={confirmType}
          amount={amount}
          recipientAddress={address!}
          onClose={() => {
            setRecipient('');
            setAmount(0);
            setAddress(undefined);
            setConfirmType(undefined);
          }} />
      }
    </TabPanel>
  );
}