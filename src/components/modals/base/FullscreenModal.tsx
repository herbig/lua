import * as React from 'react';
import { Modal, ModalContent, ModalBody, Box, ModalProps } from '@chakra-ui/react';
import { APP_MAX_W } from '../../../screens/main/AppRouter';
import { useDefaultBg, useBackButton } from '../../../utils/ui';
import { AppBarButton, AppBar } from '../../base/AppBar';

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
  useBackButton(props.isOpen, props.onClose);

  return (
    props.isOpen ?
      <Modal {...props} size='full' motionPreset="none" onClose={() => {
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
      :
      null
  );
}