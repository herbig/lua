import * as React from 'react';
import { Box, Text, BoxProps, Button, Divider, Flex, Spacer, ModalProps } from '@chakra-ui/react';
import { useAppToast } from '../../utils/ui';
import { FullscreenModal } from './FullscreenModal';
import QRCode from 'react-qr-code';
import { useAppContext } from '../../AppProvider';
import { APP_DEFAULT_H_PAD } from '../../screens/main/AppRouter';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { displayAmount, useDisplayName } from '../../utils/eth';
import { APPBAR_HEIGHT } from '../AppBar';
import { useState } from 'react';
import { CHAIN_NAME } from '../../constants';
import { ConfirmModal } from './ConfirmModal';

/** 
 * The outer component for all Settings rows. 
 * Adds default marging and a bottom divider.
 */
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

/** The user's address as a QR code. */
function SettingsQRCode({ address, ...props }: QRProps) {
  return (
    <SettingsRow {...props}>
      <Spacer />
      <Box bg="white" p='1rem' mt="1rem" mb="1rem"><QRCode value={address} /></Box>
      <Spacer />
    </SettingsRow>
  );
}
  
interface InfoProps extends BoxProps {
  title: string;
  subtitle: string;
  hidden?: boolean;
}

/** 
 * Generic "info" row, which displays a title and subtitle.
 * The subtitle is copied to the clipboard on clicking the row.
 */
function SettingsInfo({title, subtitle, hidden, ...props }: InfoProps) {
  const toast = useAppToast();
  const [shown, setShown] = useState<boolean>(!hidden);
  const onClick = () => {
    if (shown) {
      navigator.clipboard.writeText(subtitle);
      toast('Copied to clipboard.');
    } else {
      setShown(true);
    }
  };
  // TODO pressed state for click
  return (
    <SettingsRow {...props} onClick={onClick}>
      <Flex flexDirection="column">
        <Text fontSize="lg" as="b">{title}</Text>
        <Text overflowWrap="anywhere">
          {shown ? subtitle : '•'.repeat(subtitle.length)}
        </Text>
      </Flex>
    </SettingsRow>
  );
}

/**
 * A switch for changing between light / dark mode.
 */
function SettingsThemeSwitch({ ...props }: BoxProps) {
  return (
    <SettingsRow {...props}>
      <Text>Change Theme</Text>
      <Spacer />
      <ColorModeSwitcher />
    </SettingsRow>
  );
}
  
interface LogOutProps extends BoxProps {
    closeSettings: () => void
}

/**
 * A button to log the user out and return them to the login screen.
 */
function SettingsLogOut({ closeSettings, ...props }: LogOutProps) {
  const { setUser } = useAppContext();
  const [ confirmShown, setConfirmShown ] = useState(false);
  return (
    <SettingsRow {...props}>
      <Spacer />
      <Button 
        size="lg"
        minW="10rem"
        colorScheme='red'
        onClick={() => {
          setConfirmShown(true);
        }}>
          Log Out
      </Button>
      <Spacer />
      <ConfirmModal 
        shown={confirmShown}
        title='Are you sure?'
        modalBody={<Text>Back up your private key before logging out.</Text>} 
        confirmText={'Log out'} 
        onCancelClick={() => {
          setConfirmShown(false);
        }} onConfirmClick={() => {
          setConfirmShown(false);
          closeSettings();
          setUser(undefined);
        }} 
      />
    </SettingsRow>
  );
}

/**
 * A full screen modal, appearing as an app screen with an AppBar, back button, etc.
 * 
 * This displays user settings such as their QR code, wallet address, and theme switcher.
 */
export function SettingsModal({ ...props }: Omit<ModalProps, 'children'>) {
  const { wallet, ethBalance } = useAppContext();
  const { displayName } = useDisplayName(wallet?.address || '');

  return (
    <FullscreenModal 
      title='Settings'
      {...props}>
      <Flex flexDirection="column" h={`calc(100vh - ${APPBAR_HEIGHT})`} overflowY="auto">
        <SettingsQRCode address={wallet?.address || ''}/>
        <SettingsInfo title={'Wallet Balance'} subtitle={displayAmount(ethBalance)} />
        <SettingsInfo title={'Blockchain'} subtitle={CHAIN_NAME} />
        <SettingsInfo title={'Username'} subtitle={displayName} />
        <SettingsInfo title={'Eth Address'} subtitle={wallet?.address || ''} />
        <SettingsInfo hidden={true} title={'Private Key'} subtitle={wallet?.privateKey || ''} />
        <SettingsThemeSwitch />
        <SettingsLogOut closeSettings={props.onClose} />
      </Flex>
    </FullscreenModal>
  );
}