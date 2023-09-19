import * as React from 'react';
import { Button, Center, Flex, ModalProps, Text, Textarea } from '@chakra-ui/react';
import { ethDisplayAmount, useSendEth } from '../../utils/eth';
import { useTextGreen, useTextRed } from '../../utils/ui';
import { useDisplayName } from '../../utils/users';
import { useState } from 'react';
import { useRequestEth } from '../../utils/requests';
import { FullscreenModal } from '../../components/modals/base/FullscreenModal';
import { APP_DEFAULT_H_PAD } from '../main/App';
import { UserAvatar } from '../../components/avatars/UserAvatar';

export type ConfirmType = 'request' | 'send' | undefined;

interface Props extends Omit<ModalProps, 'children'> {
    type: ConfirmType
    amount: number;
    recipientAddress: string;
}

export function ConfirmSendModal({ type, amount, recipientAddress, ...props }: Props) {
  const green = useTextGreen();
  const red = useTextRed();
  const displayAmount = ethDisplayAmount(amount);
  const displayName = useDisplayName(recipientAddress);
  const [message, setMessage] = useState<string>('');
  
  const sendEth = useSendEth();
  const requestEth = useRequestEth();

  const onConfirmClick = () => {
    if (type === 'request') {
      requestEth(recipientAddress, message, amount);
    } else {
      sendEth(recipientAddress, message, amount);
    }
    props.onClose();
  };

  return (
    <FullscreenModal 
      title={type === 'request' ? 'Request Payment' : 'Confirm Payment'}
      {...props}>
      <Flex flexDirection='column' ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD} pt='2rem' pb='2rem'>
        <Text as="b" fontSize="2xl">{type === 'request' ? 'Request:' : 'Send:'}</Text>
        <Text alignSelf="center" fontSize="6xl" as="b" textColor={type === 'request' ? green : red}>{displayAmount}</Text>
        <Text as="b" fontSize="2xl">{type === 'request' ? 'From:' : 'To:'}</Text>
        <Center alignSelf="center" mb='2rem'>
          <UserAvatar w='2.5rem' h='2.5rem' mt='0.2rem' me='1rem' address={recipientAddress} />
          <Text fontSize="4xl" as="b">{displayName}</Text>
        </Center>
        <Textarea 
          id='message'
          mt='0.5rem'
          fontSize='xl'
          placeholder='What&#x27;s it for?'
          maxLength={32}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <Flex mt='2rem'>
          <Button 
            flex='1'
            borderRadius='2rem'
            size="lg"
            onClick={props.onClose}
            me='0.5rem'>
          Cancel
          </Button>
          <Button 
            flex='1'
            colorScheme='blue'
            borderRadius='2rem'
            size="lg"
            onClick={onConfirmClick}
            ms='0.5rem'>
            {type === 'request' ? 'Get ' + displayAmount : 'Pay ' + displayAmount}
          </Button>
        </Flex>
      </Flex>
    </FullscreenModal>
  );
}