import * as React from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface ConfirmModalProps {
    shown: boolean;
    title: string;
    modalBody: ReactNode;
    confirmText: string;
    onCancelClick: () => void;
    onConfirmClick: () => void;
}

export function ConfirmModal({ shown, modalBody, title, confirmText, onCancelClick, onConfirmClick }: ConfirmModalProps) {
  return (
    <Modal isOpen={shown} onClose={onCancelClick}>
      <ModalOverlay />
      <ModalContent w="80%" mt="12rem">
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {modalBody}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onConfirmClick}>{confirmText}</Button>
          <Button variant='ghost' onClick={onCancelClick}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}