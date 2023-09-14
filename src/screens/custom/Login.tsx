import * as React from 'react';
import {
  BoxProps,
  Button,
  Center,
  Image,
  Text,
  useColorMode
} from '@chakra-ui/react';
import { useAppContext } from '../../providers/AppProvider';
import { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import { newWallet } from '../../utils/eth';
import { usePasswordlessLogIn } from '../../utils/Web3Auth';
import { CHAIN_ID } from '../../providers/AppProvider';
import { LoginInput } from '../../components/custom/LoginInput';

export function Login({...props}: BoxProps) {

  // private key login
  const [ keyValue, setKeyValue ] = useState<string>();
  const { setUser } = useAppContext();

  // email passwordless login
  const [ emailValue, setEmailValue ] = useState<string>();
  const emailLogin = usePasswordlessLogIn();
  
  // default the app to dark mode
  const { setColorMode } = useColorMode();
  useEffect(() => {
    setColorMode('dark');
  }, [setColorMode]);

  return (
    <Center h="100vh" ps="3.5rem" pe="3.5rem" flexDirection="column" {...props}>
      <Text alignSelf="center" fontSize="4xl">Lua Wallet</Text>
      <Image mb="3rem" w="12rem" src={logo} />
      <Text alignSelf="center" mt='-3.5rem' mb="3rem" fontSize="l">Built on <b>{CHAIN_ID === 5 ? 'Goerli' : 'Gnosis Chain'}</b>.</Text>
      <LoginInput mb="1.5rem" onEmailValidation={setEmailValue} onKeyValidation={setKeyValue} />
      <Button 
        isDisabled={keyValue === undefined && emailValue === undefined} 
        size="lg"
        minW="10rem"
        onClick={() => {
          if (emailValue) {
            emailLogin(emailValue);
          } else if (keyValue) {
            setUser(keyValue);
          }
        }}
      >
        Sign Up / Log In
      </Button>
      <Text m="2rem" fontSize="2xl">or</Text>
      <Button 
        size="lg"
        minW="10rem"
        onClick={() => {
          setUser(newWallet());
        }}
      >
        Quick Start
      </Button>
    </Center>
  );
}