import * as React from 'react';
import { Text, BoxProps, Button, Divider, Flex, Spacer, ModalProps, useColorMode, useColorModeValue, Center, Box, AvatarBadge, VStack } from '@chakra-ui/react';
import { useAppToast } from '../../utils/ui';
import { FullscreenModal } from './FullscreenModal';
import { useAppContext } from '../../AppProvider';
import { APP_DEFAULT_H_PAD } from '../../screens/main/AppRouter';
import { displayAmount, useFaucet } from '../../utils/eth';
import { APPBAR_HEIGHT } from '../AppBar';
import { useState } from 'react';
import { ConfirmModal } from './ConfirmModal';
import { ClickablSpace } from '../ClickableSpace';
import { FaMoon, FaQrcode, FaSun } from 'react-icons/fa';
import { RampModal } from './RampModal';
import { QRModal } from './QRModal';
import { useAddressToUsername, useDisplayName } from '../../utils/users';
import { clearCache } from '../../utils/cache';
import { UserAvatar } from '../UserAvatar';
import { AvatarImageUploader } from '../AvatarImageUploader';

/** 
 * The outer component for all Settings rows. 
 * Adds default marging and a bottom divider.
 */
function SettingsRow({ children, ...props }: BoxProps) {
  return (
    <Flex flexDirection="column" {...props}>
      <ClickablSpace minH='6.5rem' ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD}>
        {children}
      </ClickablSpace>
      <Divider />
    </Flex>
  );
}
  
interface InfoProps {
  title: string;
  subtitle: string;
  hidden?: boolean;
}

/** 
 * Generic "info" row, which displays a title and subtitle.
 * The subtitle is copied to the clipboard on clicking the row.
 */
function SettingsInfo({title, subtitle, hidden }: InfoProps) {
  const toast = useAppToast();
  const [shown, setShown] = useState<boolean>(!hidden);
  const onClick = () => {
    if (shown) {
      navigator.clipboard.writeText(subtitle);
      toast('Copied to clipboard.', 'copy-setting');
    } else {
      setShown(true);
    }
  };
  return (
    <SettingsRow onClick={onClick}>
      <Flex flexDirection="column" w="100%">
        <Text fontSize="lg" as="b" mb='0.5rem'>{title}</Text>
        <Text>
          {shown ? subtitle : '•'.repeat(subtitle.length)}
        </Text>
      </Flex>
    </SettingsRow>
  );
}

/**
 * A switch for changing between light / dark mode.
 */
function SettingsThemeSwitch() {
  const { toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  return (
    <SettingsRow onClick={toggleColorMode}>
      <Text as='b' fontSize="lg">Change Theme</Text>
      <Spacer />
      <SwitchIcon />
    </SettingsRow>
  );
}

function SettingsAvatar({address, displayName, qrText}: {address: string, displayName: string, qrText: string}) {
  const [showQR, setShowQR] = useState<boolean>(false);

  return (
    <VStack pt='2rem'>
      <AvatarImageUploader>
        <UserAvatar
          w="5rem"
          h="5rem"
          address={address}
        >
          <AvatarBadge onClick={() => {setShowQR(true);}} boxSize='2rem' bg='blue.600'><FaQrcode /></AvatarBadge>
        </UserAvatar>
      </AvatarImageUploader>
      <Text fontSize='2xl' as='b'>{displayName}</Text>
      <QRModal 
        shown={showQR} 
        onClose={() => {setShowQR(false);}} 
        encodeText={qrText} />
    </VStack>
  );
}

/**
 * Show a button to perform some action.
 */
function SettingsRamp() {
  
  // on / off ramp modal states
  const [ showBuy, setShowBuy ] = useState(false);
  const [ showSell, setShowSell ] = useState(false);
    
  return (
    <Flex flexDirection="column">
      <Center flexDirection="column" minH='6.5rem' ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD}>
        <Text w='100%' fontSize="lg" as="b" mb='0.5rem'>Manage</Text>
        <Box>
          <Button 
            me='1rem'
            size="xs"
            minW="5rem"
            colorScheme='blue'
            onClick={() => {setShowBuy(true);}}>
            Deposit
          </Button>
          <Button 
            ms='1rem'
            size="xs"
            minW="5rem"
            colorScheme='blue'
            onClick={() => {setShowSell(true);}}>
            Withdraw
          </Button>
        </Box>
      </Center>
      <RampModal type={'buy'} isOpen={showBuy} onClose={() => {
        setShowBuy(false);
      }} />
      <RampModal type={'sell'} isOpen={showSell} onClose={() => {
        setShowSell(false);
      }} />
      <Divider />
    </Flex>
  );
}

function SettingsFaucet() {
  const { tap, allowFaucet } = useFaucet();
  return (
    allowFaucet ? <Center minH='6.5rem'>
      <Button 
        size="lg"
        minW="10rem"
        colorScheme='blue'
        onClick={() => {
          tap();
        }}>
          Get $0.25 free
      </Button>
    </Center>
      : 
      null
  );
}
  
/**
 * A button to log the user out and return them to the login screen.
 */
function SettingsLogOut({ closeSettings }: { closeSettings: () => void }) {
  const { setUser } = useAppContext();
  const [ confirmShown, setConfirmShown ] = useState(false);
  return (
    <Center minH='6.5rem'>
      <Button 
        size="lg"
        minW="10rem"
        colorScheme='red'
        onClick={() => {
          setConfirmShown(true);
        }}>
          Log Out
      </Button>
      <ConfirmModal 
        shown={confirmShown}
        title='Are you sure?'
        modalBody={<Text>Please back up your Wallet Password before logging out.</Text>} 
        confirmText={'Log out'} 
        onCancelClick={() => {
          setConfirmShown(false);
        }} onConfirmClick={() => {
          setConfirmShown(false);
          closeSettings();
          setUser(undefined);
          clearCache();
        }} 
      />
    </Center>
  );
}

/**
 * A full screen modal, appearing as an app screen with an AppBar, back button, etc.
 * 
 * This displays user settings such as their QR code, wallet address, and theme switcher.
 */
export function SettingsModal({ ...props }: Omit<ModalProps, 'children'>) {
  const { wallet, ethBalance } = useAppContext();
  const displayName = useDisplayName(wallet?.address || '');
  const { username } = useAddressToUsername(wallet?.address);
  return (
    <FullscreenModal 
      title='Settings'
      {...props}>
      <Flex flexDirection="column" h={`calc(100vh - ${APPBAR_HEIGHT})`} overflowY="auto">
        <SettingsAvatar address={wallet?.address || ''} displayName={displayName} qrText={username ? username : wallet?.address ? wallet.address : ''} />
        <SettingsFaucet />
        <SettingsInfo title={'Wallet Balance'} subtitle={displayAmount(ethBalance)} />
        <SettingsRamp />
        <SettingsInfo title={'User ID'} subtitle={wallet?.address || ''} />
        <SettingsInfo hidden={true} title={'Wallet Password'} subtitle={wallet?.privateKey || ''} />
        <SettingsThemeSwitch />
        <SettingsLogOut closeSettings={props.onClose} />
      </Flex>
    </FullscreenModal>
  );
}