import * as React from 'react';
import { Modal, ModalContent, ModalBody, Box, ModalProps } from '@chakra-ui/react';
import { useDefaultBg } from '../../utils/ui';
import { AppBar, AppBarButton } from '../AppBar';
import { APP_MAX_W } from '../../screens/main/AppRouter';

interface Props extends ModalProps {
  title: string;
  buttons?: AppBarButton[];
}

/**
 * Displays a fullscreen modal, appearing as an app screen with an AppBar, a back button,
 * title, and optionally a list of action buttons.
 */
export function FullscreenModal({ children, title, buttons, ...props }: Props) {
  const bg = useDefaultBg();
  return (
    <Modal {...props} size='full' onClose={() => {
      // don't close on click outside
    }}>
      <ModalContent shadow="unset" bg={bg} maxW={APP_MAX_W}>
        <ModalBody p="0">
          <AppBar backClick={props.onClose} title={title} buttons={buttons} />
          <Box>
            {children}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}