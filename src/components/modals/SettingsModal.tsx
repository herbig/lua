import * as React from 'react';
import { Box, Text, BoxProps, Button, Divider, Flex, Spacer } from '@chakra-ui/react';
import { useAppToast } from '../../utils/theme';
import { FullscreenModal } from './FullscreenModal';
import QRCode from 'react-qr-code';
import { useAppContext } from '../../AppProvider';
import { APP_DEFAULT_H_PAD } from '../../screens/main/AppRouter';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { displayAmount } from '../../utils/eth';
import { APPBAR_HEIGHT } from '../AppBar';

function SettingsRow({ children, ...props }: BoxProps) {
  return (
    <Flex flexDirection="column">
      <Flex minH='7rem' ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD} alignItems="center" {...props}>
        {children}
      </Flex>
      <Divider />
    </Flex>
  );
}
  
  interface QRProps extends BoxProps {
    address: string;
  }
  
function SettingsQRCode({ address, ...props }: QRProps) {
  return (
    <SettingsRow {...props}>
      <Spacer />
      <Box mt="1rem" mb="1rem"><QRCode value={address} /></Box>
      <Spacer />
    </SettingsRow>
  );
}
  
  interface InfoProps extends BoxProps {
    title: string;
    subtitle: string;
  }
  
function SettingsInfo({title, subtitle, ...props }: InfoProps) {
  const toast = useAppToast();
  const onClick = () => {
    navigator.clipboard.writeText(subtitle);
    toast('Copied to clipboard.');
  };
    // TODO pressed state for click
  return (
    <SettingsRow {...props} onClick={onClick}>
      <Flex flexDirection="column">
        <Text fontSize="lg" as="b">{title}</Text>
        <Text overflowWrap="anywhere">{subtitle}</Text>
      </Flex>
    </SettingsRow>
  );
}
  
function SettingsThemeSwitch({ ...props }: BoxProps) {
  return (
    <SettingsRow {...props}>
      <Text>Change Theme</Text>
      <Spacer />
      <ColorModeSwitcher />
    </SettingsRow>
  );
}
  
interface SettingsProps extends BoxProps {
    closeSettings: () => void
}

function SettingsLogOut({ closeSettings, ...props }: SettingsProps) {
  const { setUser } = useAppContext();
  return (
    <SettingsRow {...props}>
      <Spacer />
      <Button 
        size="lg"
        minW="10rem"
        colorScheme='red'
        onClick={() => {
          closeSettings();
          setUser(undefined);
        }}>Log Out</Button>
      <Spacer />
    </SettingsRow>
  );
}

interface Props {
  shown: boolean;
  onClose: () => void;
}

export function SettingsModal({ shown, onClose }: Props) {
  const { wallet, ethBalance } = useAppContext();
  return (
    <FullscreenModal 
      title='Settings' 
      isOpen={shown}
      onClose={onClose}>
      <Flex flexDirection="column" h={`calc(100vh - ${APPBAR_HEIGHT})`} overflowY="auto">
        <SettingsQRCode address={wallet?.address || ''}/>
        <SettingsInfo title={'Wallet Balance'} subtitle={displayAmount(ethBalance)} />
        <SettingsInfo title={'Eth Address'} subtitle={wallet?.address || ''} />
        {/* TODO show/hide private key */}
        <SettingsInfo title={'Private Key'} subtitle={wallet?.privateKey || ''} />
        <SettingsThemeSwitch />
        <SettingsLogOut closeSettings={onClose} />
      </Flex>
    </FullscreenModal>
  );
}