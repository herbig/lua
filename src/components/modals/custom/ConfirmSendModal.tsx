import * as React from 'react';
import { Text, Textarea, VStack } from '@chakra-ui/react';
import { ethDisplayAmount, useSendEth } from '../../../utils/eth';
import { useTextGreen } from '../../../utils/ui';
import { ConfirmModal, ConfirmModalProps } from '../base/ConfirmModal';
import { useDisplayName } from '../../../utils/users';
import { useState } from 'react';

interface Props extends Omit<ConfirmModalProps, 'title' | 'modalBody' | 'confirmText'> {
    amount: number;
    recipientAddress: string;
}

export function ConfirmSendModal({ amount, recipientAddress, ...props }: Props) {
  const green = useTextGreen();
  const displayAmount = ethDisplayAmount(amount);
  const displayName = useDisplayName(recipientAddress);
  const [message, setMessage] = useState<string>('');
  const { sendEth } = useSendEth();

  return (
    <ConfirmModal 
      {...props}
      title="Confirm Transfer"
      onConfirmClick={() => {
        props.onConfirmClick();
        sendEth(recipientAddress, message, amount);
      }}
      modalBody={
        <VStack>
          <Text as="b" alignSelf="start">Send:</Text>
          <Text fontSize="5xl" as="b" textColor={green}>{displayAmount}</Text>
          <Text as="b" alignSelf="start">To:</Text>
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
      confirmText={'Send ' + displayAmount} 
    />
  );
}