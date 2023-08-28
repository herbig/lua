import * as React from 'react';
import { Button, Flex, Text, BoxProps, ButtonProps, Spacer, Divider, useToast } from '@chakra-ui/react';
import { useAppContext } from '../AppProvider';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';
import { AppBar } from '../components/AppBar';
import { APP_DEFAULT_H_PAD } from './main/AppRouter';
import { FullScreenOverlay } from '../components/FullScreenOverlay';
import { displayAmount } from '../utils/eth';

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
    <SettingsRow {...props}
      onClick={onClick}>
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

function SettingsLogOut({ ...props }: ButtonProps) {
  const { setUser } = useAppContext();
  return (
    <Button mt="2rem" ms={APP_DEFAULT_H_PAD} me={APP_DEFAULT_H_PAD} onClick={() => {setUser(undefined);}} {...props}>Log Out</Button>
  );
}

export function Settings({ onBackClicked, ...props }: Props) {
  const { wallet, ethBalance } = useAppContext();

  return (
    <FullScreenOverlay {...props}>
      <AppBar backClick={onBackClicked} title='Settings' />
      <Flex flexDirection="column">
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