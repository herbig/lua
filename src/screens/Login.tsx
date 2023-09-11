import * as React from 'react';
import {
  BoxProps,
  Button,
  Center,
  Image,
  Text,
  useColorMode
} from '@chakra-ui/react';
import { PrivateKeyInput } from '../components/PrivateKeyInput';
import { useAppContext } from '../AppProvider';
import { useEffect, useState } from 'react';
import source from '../assets/logo192.png';
import { newWallet } from '../utils/eth';
import { CHAIN_NAME, ETH_NAME } from '../constants';

export function Login({...props}: BoxProps) {
  const { setUser } = useAppContext();
  const [ keyInput, setKeyInput ] = useState<string>();
  const { setColorMode } = useColorMode();
  
  // default the app to light mode
  useEffect(() => {
    setColorMode('light');
  }, [setColorMode]);

  return (
    <Center h="100vh" ps="3rem" pe="3rem" flexDirection="column" {...props}>
      <Image mb="3rem" w="12rem" src={source} />
      <Text alignSelf="start" mb="1.5rem" fontSize="l">This demo uses <b>{ETH_NAME}</b> on <b>{CHAIN_NAME}</b>.</Text>
      <Text alignSelf="start" mb="1.5rem" fontSize="l">If you would like a few cents to test, DM me your Eth address on Telegram <b>@michaelherbig</b></Text>
      <PrivateKeyInput mb="1.5rem" onKeyValidation={setKeyInput} />
      <Button 
        isDisabled={keyInput === undefined} 
        onClick={() => {
          setUser(keyInput);
        }}
        size="lg"
        minW="10rem"
        mb="1.5rem"
      >
        Log In
      </Button>
      <Text mb="1.5rem" fontSize="xl">or</Text>
      <Button 
        onClick={() => {
          setUser(newWallet());
        }}
        size="lg"
        minW="10rem"
      >
        New Wallet
      </Button>
    </Center>
  );
}