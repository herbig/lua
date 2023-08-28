import * as React from 'react';
import { BoxProps, Flex } from '@chakra-ui/react';
import { AppBar } from '../components/AppBar';
import { APP_DEFAULT_H_PAD } from './main/AppRouter';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { FullScreenOverlay } from '../components/FullScreenOverlay';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import { useAppContext } from '../AppProvider';

interface Props extends BoxProps {
  onBackClicked: () => void;
}

export function QRCodeScanner({ onBackClicked, ...props }: Props) {
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const { wallet } = useAppContext();

  return (
    <FullScreenOverlay {...props}>
      <AppBar backClick={onBackClicked} title='QR Code' />
      <Flex flexDirection="column" ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD}>
        <QRCode value={wallet?.address || ''} />
        <QrScanner
          onDecode={(result) => console.log(result)}
          onError={(error) => console.log(error?.message)}
        />
      </Flex>
    </FullScreenOverlay>
  );
}