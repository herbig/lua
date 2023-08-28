import * as React from 'react';
import { Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';

interface Props {
    shown: boolean;
    amount: number;
    recipient: string;
    onCancelClick: () => void;
    onConfirmClick: () => void;
}

// TODO make a generic progressbar modal

export function ConfirmSendModal({ shown, amount, recipient, onCancelClick, onConfirmClick }: Props) {
  return (
    <>
      <Modal isOpen={shown} onClose={onCancelClick}>
        <ModalOverlay />
        <ModalContent w="90%" mt="50%">
          <ModalHeader>Confirm Send</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="0.25rem">Are you sure you would like to send:</Text>
            <Text mb="0.25rem" fontSize="xs" as="b">${amount}</Text>
            <Text mb="0.25rem">to:</Text>
            <Text mb="0.25rem" fontSize="xs">{recipient}</Text>
            <Text mb="0.25rem" as="i">This cannot be reversed.</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onConfirmClick}>Send ${amount}</Button>
            <Button variant='ghost' onClick={onCancelClick}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}