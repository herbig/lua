import * as React from 'react';
import { Flex, ModalProps, Text } from '@chakra-ui/react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { isAddress } from 'web3-validator';
import { FullscreenModal } from './FullscreenModal';
import { APP_DEFAULT_H_PAD } from '../../screens/main/AppRouter';
import { isValidUsername } from '../../utils/eth';
import { useAppToast } from '../../utils/ui';

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
            if (isAddress(result) || isValidUsername(result)) {
              onDecode(result);
              props.onClose();
            } else {
              toast('Not a valid user.', 'invalid-qr');
            }
          }}
          onError={() => {
            props.onClose();
          }}
        />
        <Text pt="1rem" as="b" alignSelf="center">Scan a Lua app QR code.</Text>
      </Flex>
    </FullscreenModal>
  );
}