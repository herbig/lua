import * as React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { useAppToast } from '../../utils/theme';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { isAddress } from 'web3-validator';
import { FullscreenModal } from './FullscreenModal';
import { APP_DEFAULT_H_PAD } from '../../screens/main/AppRouter';

interface Props {
  shown: boolean;
  onClose: () => void;
  onDecode: (address: string) => void;
}

export function QRScanModal({ shown, onClose, onDecode }: Props) {
  const toast = useAppToast();
  return (
    <FullscreenModal 
      title='QR Scan' 
      isOpen={shown}
      onClose={onClose}>
      <Flex flexDirection="column" pt="1rem" ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD}>      
        <QrScanner
          onDecode={(result) => {
            if (isAddress(result)) {
              onDecode(result);
              onClose();
            } else {
              toast('Not an address.');
            }
          }}
          onError={() => {
            toast('Something went wrong, try again.', true);
            onClose();
          }}
        />
        <Text pt="1rem" as="b" alignSelf="center">Scan an address QR code.</Text>
      </Flex>
    </FullscreenModal>
  );
}