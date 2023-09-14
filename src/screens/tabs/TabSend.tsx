import * as React from 'react';
import {
  Button,
  Flex,
  TabPanel,
  TabPanelProps
} from '@chakra-ui/react';
import { useState } from 'react';
import { ConfirmSendModal } from '../../components/modals/custom/ConfirmSendModal';
import { APP_DEFAULT_H_PAD } from '../main/App';
import { useAppContext } from '../../providers/AppProvider';
import { useSendEth, workableEth } from '../../utils/eth';
import { EthAddressSelector } from '../../components/custom/EthAddressSelector';
import { NumberPad } from '../../components/custom/NumberPad';

export function TabSend({...props}: TabPanelProps) {
  // used to reset the address input after sending
  const [recipient, setRecipient] = useState<string>('');
  // holds the validated address, or undefined if the input isn't valid
  const [address, setAddress] = useState<string>();
  // show/hide the confirmation dialog
  const [confirmShown, setConfirmShown] = useState<boolean>(false);
  // the amount set via the number pad
  const [amount, setAmount] = useState<number>(0);
  // maximum amount able to be sent, truncated to the nearest 'cent'
  const { ethBalance } = useAppContext();

  const maxSend = workableEth(ethBalance);

  const { sendEth } = useSendEth();

  const sendDisabled = !address || maxSend == 0 || amount == 0;

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
        <Button 
          isDisabled={sendDisabled} 
          mt="1rem" 
          size="lg"
          minW="10rem"
          colorScheme='blue' 
          alignSelf="center" 
          onClick={() => {
            setConfirmShown(true);
          }}>
          Send
        </Button>
      </Flex>
      
      {confirmShown && 
        <ConfirmSendModal
          shown={confirmShown}
          amount={amount}
          recipientAddress={address ? address : ''}
          onConfirmClick={() => {
            sendEth(address!, amount);
            setRecipient('');
            setAmount(0);
            setAddress(undefined);
            setConfirmShown(false);
          }} 
          onCancelClick={() => {
            setConfirmShown(false);
          }} />
      }
    </TabPanel>
  );
}