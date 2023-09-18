import * as React from 'react';
import { Text, Textarea, VStack } from '@chakra-ui/react';
import { ethDisplayAmount, useSendEth } from '../../../utils/eth';
import { useTextGreen } from '../../../utils/ui';
import { ConfirmModal, ConfirmModalProps } from '../base/ConfirmModal';
import { useDisplayName } from '../../../utils/users';
import { useState } from 'react';
import { useRequestEth } from '../../../utils/requests';

export type ConfirmType = 'request' | 'send' | undefined;

interface Props extends Omit<ConfirmModalProps, 'title' | 'modalBody' | 'confirmText'> {
    type: ConfirmType
    amount: number;
    recipientAddress: string;
}

export function ConfirmSendModal({ type, amount, recipientAddress, ...props }: Props) {
  const green = useTextGreen();
  const displayAmount = ethDisplayAmount(amount);
  const displayName = useDisplayName(recipientAddress);
  const [message, setMessage] = useState<string>('');
  const sendEth = useSendEth();
  const requestEth = useRequestEth();

  return (
    <ConfirmModal 
      {...props}
      title={type === 'request' ? 'Request Payment' : 'Confirm Payment'}
      onConfirmClick={() => {
        props.onConfirmClick();
        if (type === 'request') {
          requestEth(recipientAddress, message, amount);
        } else {
          sendEth(recipientAddress, message, amount);
        }
      }}
      modalBody={
        <VStack>
          <Text as="b" alignSelf="start">{type === 'request' ? 'Request:' : 'Send:'}</Text>
          <Text fontSize="5xl" as="b" textColor={green}>{displayAmount}</Text>
          <Text as="b" alignSelf="start">{type === 'request' ? 'From:' : 'To:'}</Text>
          <Text fontSize="3xl" as="b" textColor={green}>{displayName}</Text>
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
        </VStack>
      }
      confirmText={type === 'request' ? 'Get ' + displayAmount : 'Pay ' + displayAmount}
    />
  );
}