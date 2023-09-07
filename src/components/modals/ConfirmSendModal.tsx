import * as React from 'react';
import { Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, VStack } from '@chakra-ui/react';
import { displayAmount, useDisplayName } from '../../utils/eth';
import { useGreenText } from '../../utils/ui';

interface Props {
    shown: boolean;
    amount: number;
    recipient: string;
    onCancelClick: () => void;
    onConfirmClick: () => void;
}

export function ConfirmSendModal({ shown, amount, recipient, onCancelClick, onConfirmClick }: Props) {
  const display = displayAmount(amount);
  const green = useGreenText();
  const { displayName } = useDisplayName(recipient);
  return (
    <Modal isOpen={shown} onClose={onCancelClick}>
      <ModalOverlay />
      <ModalContent w="80%" mt="12rem">
        <ModalHeader>Confirm Send</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack alignItems="start">
            <Text as="b">Send:</Text>
            <Text alignSelf="center" fontSize="4xl" as="b" textColor={green}>{display}</Text>
            <Text as="b">to:</Text>
            <Text alignSelf="center" fontSize="4xl" as="b" textColor={green}>{displayName}</Text>
            <Text mt="1rem" as="i">This cannot be reversed.</Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onConfirmClick}>Send {display}</Button>
          <Button variant='ghost' onClick={onCancelClick}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}