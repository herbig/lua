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
import { useGetEthBalance, useSendEth } from '../../utils/eth';

export function TabSend({...props}: TabPanelProps) {
  // used to clear the input after sending
  const [inputValue, setInputValue] = useState<string>('');
  // holds the validated address, or undefined if the input isn't valid
  const [validatedAddress, setValidatedAddress] = useState<string>();
  const [amount, setAmount] = useState<number>(0);
  // TODO put wallet in provider
  const { balance } = useGetEthBalance('0x7ea30CE56a67Aa5dc19b34242db1B97927Bf850b');
  const { sendEth, isSending } = useSendEth();
  
  // truncate to the nearest cent
  const maxSend = balance ? Number(balance.substring(0, balance.indexOf('.') + 3)) : 0;

  const sendDisabled = !validatedAddress || maxSend == 0 || amount == 0 || isSending;

  return (
    <TabPanel p="1rem" h="100%" {...props}>
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
          sendEth(validatedAddress!, amount);
          setInputValue('');
        }}>
          Send
        </Button>
      </Flex>
    </TabPanel>
  );
}