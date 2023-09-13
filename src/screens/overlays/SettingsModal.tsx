import * as React from 'react';
import { Text, BoxProps, Button, Divider, Flex, Spacer, ModalProps, useColorMode, useColorModeValue, Center, Box, AvatarBadge, VStack } from '@chakra-ui/react';
import { FaMoon, FaSun, FaQrcode } from 'react-icons/fa';
import { RampModal } from './RampModal';
import { AvatarImageUploader } from '../../components/avatars/AvatarImageUploader';
import { UserAvatar } from '../../components/avatars/UserAvatar';
import { APPBAR_HEIGHT } from '../../components/base/AppBar';
import { ClickablSpace } from '../../components/base/ClickableSpace';
import { ConfirmModal } from '../../components/modals/base/ConfirmModal';
import { FullscreenModal } from '../../components/modals/base/FullscreenModal';
import { QRModal } from '../../components/modals/custom/QRModal';
import { useAppContext } from '../../providers/AppProvider';
import { clearCache } from '../../utils/cache';
import { useFaucet, displayAmount } from '../../utils/eth';
import { useAppToast } from '../../utils/ui';
import { useDisplayName, useAddressToUsername } from '../../utils/users';
import { APP_DEFAULT_H_PAD } from '../main/AppRouter';

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

/** 
 * The outer component for Settings rows. 
 * Adds default margin and a bottom divider.
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
  
/** 
 * Generic "info" row, which displays a title and subtitle.
 * The subtitle is copied to the clipboard on clicking the row.
 */
function SettingsInfo({title, subtitle, hidden }: 
  {title: string; subtitle: string; hidden?: boolean;}) {

  const toast = useAppToast();
  const [shown, setShown] = React.useState<boolean>(!hidden);
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
        <Text>{shown ? subtitle : '•'.repeat(subtitle.length)}</Text>
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
  const [showQR, setShowQR] = React.useState<boolean>(false);

  return (
    <VStack pt='2rem'>
      <AvatarImageUploader>
        <UserAvatar
          w="5rem"
          h="5rem"
          address={address}
        >
          <AvatarBadge onClick={(e) => {
            e.stopPropagation(); // prevents opening the file uploader
            setShowQR(true);
          }} boxSize='2rem' bg='blue.600'>
            <FaQrcode />
          </AvatarBadge>
        </UserAvatar>
      </AvatarImageUploader>
      <Text fontSize='2xl' as='b'>{displayName}</Text>
      {showQR && 
        <QRModal 
          shown={showQR} 
          onClose={() => {setShowQR(false);}} 
          encodeText={qrText} />
      }
    </VStack>
  );
}

/**
 * Show a button to perform some action.
 */
function SettingsRamp() {
  
  // on / off ramp modal states
  const [ showBuy, setShowBuy ] = React.useState(false);
  const [ showSell, setShowSell ] = React.useState(false);
    
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
      {showBuy &&
        <RampModal type={'buy'} isOpen={showBuy} onClose={() => {
          setShowBuy(false);
        }} />
      }
      {showSell &&
        <RampModal type={'sell'} isOpen={showSell} onClose={() => {
          setShowSell(false);
        }} />
      }
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
  const [ confirmShown, setConfirmShown ] = React.useState(false);
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
      {confirmShown &&
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
      }
    </Center>
  );
}