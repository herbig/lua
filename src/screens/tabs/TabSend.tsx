import * as React from 'react';
import {
  Button,
  Flex,
  TabPanel,
  TabPanelProps
} from '@chakra-ui/react';
import { NumberPad } from '../../components/NumberPad';
import { useState } from 'react';
import { EthAddressInput } from '../../components/EthAddressInput';
import { ConfirmSendModal } from '../../components/ConfirmSendModal';
import { APP_DEFAULT_H_PAD } from '../main/AppRouter';
import { useAppContext } from '../../AppProvider';
import { cutToCents, useSendEth } from '../../utils/eth';

export function TabSend({...props}: TabPanelProps) {
  // used to clear the input after sending
  const [inputValue, setInputValue] = useState<string>('');
  // holds the validated address, or undefined if the input isn't valid
  const [validatedAddress, setValidatedAddress] = useState<string>();
  // show/hide the confirmation dialog
  const [confirmShown, setConfirmShown] = useState<boolean>(false);
  // the amount set via the number pad
  const [amount, setAmount] = useState<number>(0);
  // maximum amount able to be sent, truncated to the nearest 'cent'
  const { ethBalance } = useAppContext();
  const maxSend = cutToCents(ethBalance);

  const { sendEth, isSending } = useSendEth();

  const sendDisabled = !validatedAddress || maxSend == 0 || amount == 0 || isSending;

  return (
    <TabPanel pt="1rem" pb="1rem" ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD} h="100%" {...props}>
      <Flex flexDirection="column" h="100%">
        <EthAddressInput 
          placeholder='Recipient Address' 
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          onAddressValidation={setValidatedAddress} />
        <NumberPad 
          flex="1"
          accountMax={maxSend}
          onNumberChanged={setAmount}
        />
        <Button isDisabled={sendDisabled} mt="1rem" size="lg" colorScheme='blue' alignSelf="center" onClick={() => {
          setConfirmShown(true);
        }}>
          Send
        </Button>
      </Flex>
      {/* Confirmation Modal, doesn't appear in the view tree,
       it just needs to be added somewhere here... */}
      <ConfirmSendModal
        shown={confirmShown}
        amount={amount}
        recipient={validatedAddress!}
        onConfirmClick={() => {
          sendEth(validatedAddress!, amount);
          setInputValue('');
          setConfirmShown(false);
        }} 
        onCancelClick={() => {
          setConfirmShown(false);
        }} />
    </TabPanel>
  );
}