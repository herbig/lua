import * as React from 'react';
import { Flex, ModalProps, Text } from '@chakra-ui/react';
import { useAppToast } from '../../utils/ui';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { isAddress } from 'web3-validator';
import { FullscreenModal } from './FullscreenModal';
import { APP_DEFAULT_H_PAD } from '../../screens/main/AppRouter';

interface Props extends Omit<ModalProps, 'children'> {
  onDecode: (address: string) => void;
}

/**
 * A full screen "modal" which handles QR code scanning.
 * 
 * This appears as an app screen, with an AppBar and back button.
 */
export function QRScanModal({ onDecode, ...props }: Props) {
  const toast = useAppToast();
  return (
    <FullscreenModal 
      title='QR Scan' 
      {...props}>
      <Flex flexDirection="column" pt="1rem" ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD}>      
        <QrScanner
          onDecode={(result) => {
            if (isAddress(result)) {
              onDecode(result);
              props.onClose();
            } else {
              toast('Not an address.');
            }
          }}
          onError={() => {
            toast('Something went wrong, try again.', true);
            props.onClose();
          }}
        />
        <Text pt="1rem" as="b" alignSelf="center">Scan an address QR code.</Text>
      </Flex>
    </FullscreenModal>
  );
}