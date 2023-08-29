import * as React from 'react';
import { Button, Flex, Text, BoxProps, Spacer, Divider, useToast, Box } from '@chakra-ui/react';
import { useAppContext } from '../AppProvider';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';
import { APPBAR_HEIGHT, AppBar } from '../components/AppBar';
import { APP_DEFAULT_H_PAD } from './main/AppRouter';
import { FullScreenOverlay } from '../components/FullScreenOverlay';
import { displayAmount } from '../utils/eth';
import QRCode from 'react-qr-code';

interface Props extends BoxProps {
  onBackClicked: () => void;
}

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
  const toast = useToast();
  const onClick = () => {
    navigator.clipboard.writeText(subtitle);
    toast({
      description: 'Copied to clipboard.',
      duration: 4000,
      isClosable: false
    });
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

function SettingsLogOut({ ...props }: BoxProps) {
  const { setUser } = useAppContext();
  return (
    <SettingsRow {...props}>
      <Spacer />
      <Button 
        ps="3rem"
        pe="3rem"
        colorScheme='red'
        ms={APP_DEFAULT_H_PAD}
        me={APP_DEFAULT_H_PAD} 
        onClick={() => {setUser(undefined);}}>Log Out</Button>
      <Spacer />
    </SettingsRow>
  );
}

export function Settings({ onBackClicked, ...props }: Props) {
  const { wallet, ethBalance } = useAppContext();

  return (
    <FullScreenOverlay {...props}>
      <AppBar backClick={onBackClicked} title='Settings' />
      <Flex flexDirection="column" h={`calc(100vh - ${APPBAR_HEIGHT})`} overflowY="auto">
        <SettingsQRCode address={wallet?.address || ''}/>
        <SettingsInfo title={'Wallet Balance'} subtitle={displayAmount(ethBalance)} />
        <SettingsInfo title={'Eth Address'} subtitle={wallet?.address || ''} />
        {/* TODO show/hide private key */}
        <SettingsInfo title={'Private Key'} subtitle={wallet?.privateKey || ''} />
        <SettingsThemeSwitch />
        <SettingsLogOut />
      </Flex>
    </FullScreenOverlay>
  );
}