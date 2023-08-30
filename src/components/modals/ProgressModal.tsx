import * as React from 'react';
import { Text, Modal, ModalOverlay, ModalContent, ModalBody, CircularProgress, Flex } from '@chakra-ui/react';

/**
 * A generic progress spinner modal, that takes the full screen and prevents
 * further engagement.
 * 
 * Opening the modal involves giving it a message, and closing it again would
 * require setting the message supplied as undefined.
 */
export function ProgressModal({ message }: { message?: string; }) {
  return (
    <Modal isOpen={!!message} closeOnOverlayClick={false} onClose={()=>{
      // don't close on click outside
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