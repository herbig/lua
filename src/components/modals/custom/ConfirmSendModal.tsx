import * as React from 'react';
import { Text, VStack } from '@chakra-ui/react';
import { displayAmount } from '../../../utils/eth';
import { useGreenText } from '../../../utils/ui';
import { ConfirmModal, ConfirmModalProps } from '../base/ConfirmModal';
import { useDisplayName } from '../../../utils/users';

interface Props extends Omit<ConfirmModalProps, 'title' | 'confirmText' | 'modalBody'> {
    amount: number;
    recipient: string;
}

export function ConfirmSendModal({ amount, recipient, ...props }: Props) {
  const display = displayAmount(amount);
  const green = useGreenText();
  const displayName = useDisplayName(recipient);
  return (
    <ConfirmModal 
      {...props}
      title="Confirm Send"
      modalBody={
        <VStack alignItems="start">
          <Text as="b">Send:</Text>
          <Text alignSelf="center" fontSize="4xl" as="b" textColor={green}>{display}</Text>
          <Text as="b">to:</Text>
          <Text alignSelf="center" fontSize="4xl" as="b" textColor={green}>{displayName}</Text>
          <Text mt="1rem" as="i">This cannot be reversed.</Text>
        </VStack>
      }
      confirmText={'Send ' + display} 
    />
  );
}