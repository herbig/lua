import * as React from 'react';
import { Text, BoxProps, Button, Divider, Flex, Spacer, ModalProps, useColorMode, useColorModeValue, Center } from '@chakra-ui/react';
import { FullscreenModal } from '../../components/modals/base/FullscreenModal';
import { FaMoon, FaSun } from 'react-icons/fa';
import { APPBAR_HEIGHT } from '../../components/base/AppBar';
import { ClickablSpace } from '../../components/base/ClickableSpace';
import { ConfirmModal } from '../../components/modals/base/ConfirmModal';
import { useAppContext } from '../../providers/AppProvider';
import { clearCache } from '../../utils/cache';
import { displayAmount } from '../../utils/eth';
import { useAppToast } from '../../utils/ui';
import { APP_DEFAULT_H_PAD } from '../main/AppRouter';

/**
 * A full screen modal, appearing as an app screen with an AppBar, back button, etc.
 * 
 * This displays user settings such as their QR code, wallet address, and theme switcher.
 */
export function SettingsModal({ ...props }: Omit<ModalProps, 'children'>) {
  const { wallet, ethBalance } = useAppContext();
  // const displayName = useDisplayName(wallet?.address || '');
  // const { username } = useAddressToUsername(wallet?.address);
  return (
    <FullscreenModal 
      title='Settings'
      {...props}>
      <Flex flexDirection="column" h={`calc(100vh - ${APPBAR_HEIGHT})`} overflowY="auto">
        {/* <SettingsAvatar address={wallet?.address || ''} displayName={displayName} qrText={username ? username : wallet?.address ? wallet.address : ''} /> */}
        {/* <SettingsFaucet /> */}
        <SettingsInfo title={'Wallet Balance'} subtitle={displayAmount(ethBalance)} />
        {/* <SettingsRamp /> */}
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