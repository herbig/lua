import * as React from 'react';
import { Text, Modal, ModalOverlay, ModalContent, ModalBody, CircularProgress, Flex } from '@chakra-ui/react';

export function ProgressModal({ message }: { message?: string; }) {
  return (
    <Modal isOpen={!!message} closeOnOverlayClick={false} onClose={()=>{
      // unused
    }}>
      <ModalOverlay />
      <ModalContent w="60%" mt="50%">
        <ModalBody>
          <Flex p="1rem" flexDirection="column" alignItems="center">
            <CircularProgress mb="1rem" size='3rem' isIndeterminate />
            <Text as="b">{message}</Text>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}