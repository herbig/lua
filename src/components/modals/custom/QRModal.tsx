import * as React from 'react';
import { Modal, ModalOverlay, ModalContent, Box, Center } from '@chakra-ui/react';
import QRCode from 'react-qr-code';

interface Props {
    shown: boolean;
    onClose:  () => void;
    encodeText: string;
}

export function QRModal({ shown, onClose, encodeText }: Props) {
  return (
    <Modal isOpen={shown} onClose={onClose} size='xs'>
      <ModalOverlay />
      <ModalContent mt="12rem">
        <Center p='1rem'>
          <Box bg="white" p='1rem'>
            <QRCode value={encodeText} />
          </Box>
        </Center>
      </ModalContent>
    </Modal>
  );
}