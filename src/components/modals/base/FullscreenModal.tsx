import * as React from 'react';
import { Modal, ModalContent, ModalBody, ModalProps, Flex } from '@chakra-ui/react';
import { APP_MAX_W } from '../../../screens/main/App';
import { useDefaultBg, useBackButton } from '../../../utils/ui';
import { AppBarButton, AppBar, APPBAR_HEIGHT } from '../../base/AppBar';

export const MODAL_CONTENT_HEIGHT = `calc(100vh - ${APPBAR_HEIGHT})`;

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
      <Modal {...props} size='full' onClose={() => {}}>
        <ModalContent shadow="unset" bg={bg} maxW={APP_MAX_W} userSelect='none'>
          <ModalBody p="0">
            <AppBar backClick={props.onClose} title={title} buttons={buttons} />
            <Flex h={MODAL_CONTENT_HEIGHT} flexDirection="column" overflowY="auto">
              {children}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      :
      null
  );
}