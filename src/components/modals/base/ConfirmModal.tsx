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
      <ModalContent w="80%" mt="10rem" userSelect='none'>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {modalBody}
        </ModalBody>
        <ModalFooter>
          <Button borderRadius='2rem' variant='ghost'  mr='0.5rem' onClick={onCancelClick}>Cancel</Button>
          <Button borderRadius='2rem' colorScheme='blue' onClick={onConfirmClick}>{confirmText}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}