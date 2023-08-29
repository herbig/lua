import * as React from 'react';
import { Modal, ModalContent, ModalBody, Box, ModalProps } from '@chakra-ui/react';
import { useDefaultBg } from '../../utils/theme';
import { AppBar, AppBarButton } from '../AppBar';
import { APP_MAX_W } from '../../screens/main/AppRouter';

interface Props extends ModalProps {
  title: string;
  buttons?: AppBarButton[];
  onClose: () => void;
}

export function FullscreenModal({ children, title, buttons, onClose, ...props }: Props) {
  const bg = useDefaultBg();
  return (
    <Modal {...props} size='full' onClose={() => {
      // unused
    }}>
      <ModalContent bg={bg} maxW={APP_MAX_W}>
        <ModalBody p="0">
          <AppBar backClick={onClose} title={title} buttons={buttons} />
          <Box>
            {children}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}