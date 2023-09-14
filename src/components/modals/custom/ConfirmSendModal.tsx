import * as React from 'react';
import { Text, VStack } from '@chakra-ui/react';
import { ethDisplayAmount } from '../../../utils/eth';
import { useTextGreen } from '../../../utils/ui';
import { ConfirmModal, ConfirmModalProps } from '../base/ConfirmModal';
import { useDisplayName } from '../../../utils/users';

interface Props extends Omit<ConfirmModalProps, 'title' | 'modalBody' | 'confirmText'> {
    amount: number;
    recipientAddress: string;
}

export function ConfirmSendModal({ amount, recipientAddress, ...props }: Props) {
  const green = useTextGreen();
  const displayAmount = ethDisplayAmount(amount);
  const displayName = useDisplayName(recipientAddress);
  return (
    <ConfirmModal 
      {...props}
      title="Confirm Transfer"
      modalBody={
        <VStack>
          <Text as="b" alignSelf="start">Send:</Text>
          <Text fontSize="5xl" as="b" textColor={green}>{displayAmount}</Text>
          <Text as="b" alignSelf="start">To:</Text>
          <Text fontSize="3xl" as="b" textColor={green}>{displayName}</Text>
        </VStack>
      }
      confirmText={'Send ' + displayAmount} 
    />
  );
}