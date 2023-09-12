import * as React from 'react';
import {
  BoxProps,
  Button,
  Center,
  Image,
  Text,
  useColorMode
} from '@chakra-ui/react';
import { LoginInput } from '../components/LoginInput';
import { useAppContext } from '../AppProvider';
import { useEffect, useState } from 'react';
import source from '../assets/logo192.png';
import { newWallet } from '../utils/eth';
import { CHAIN_NAME, ETH_NAME } from '../constants';
import { clearCache } from '../utils/cache';
import { usePasswordlessLogIn } from '../web3auth/Web3Auth';

export function Login({...props}: BoxProps) {
  const { setColorMode } = useColorMode();
  const { setUser } = useAppContext();

  const [ keyValue, setKeyValue ] = useState<string>();

  // email / passwordless login
  const [ emailValue, setEmailValue ] = useState<string>();
  const logIn = usePasswordlessLogIn();
  
  // default the app to light mode
  useEffect(() => {
    setColorMode('light');
  }, [setColorMode]);

  // clear the local storage cache
  clearCache();

  return (
    <Center h="100vh" ps="3rem" pe="3rem" flexDirection="column" {...props}>
      <Image mb="3rem" w="12rem" src={source} />
      <Text alignSelf="start" mb="1.5rem" fontSize="l">This demo uses <b>{ETH_NAME}</b> on <b>{CHAIN_NAME}</b>.</Text>
      <Text alignSelf="start" mb="1.5rem" fontSize="l">If you would like a few cents to test, DM me your Eth address on Telegram <b>@michaelherbig</b></Text>
      <LoginInput mb="1.5rem" onEmailValidation={setEmailValue} onKeyValidation={setKeyValue} />
      <Button 
        isDisabled={keyValue === undefined && emailValue === undefined} 
        onClick={() => {
          if (emailValue) {
            logIn(emailValue);
          } else if (keyValue) {
            setUser(keyValue);
          }
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