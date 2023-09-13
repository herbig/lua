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
import source from '../../assets/logo.png';
import { newWallet } from '../../utils/eth';
import { usePasswordlessLogIn } from '../../utils/Web3Auth';
import { CHAIN_ID } from '../../providers/AppProvider';
import { LoginInput } from '../../components/custom/LoginInput';

export function Login({...props}: BoxProps) {
  const { setColorMode } = useColorMode();
  const { setUser } = useAppContext();

  const [ keyValue, setKeyValue ] = useState<string>();

  // email / passwordless login
  const [ emailValue, setEmailValue ] = useState<string>();
  const logIn = usePasswordlessLogIn();
  
  // default the app to dark mode
  useEffect(() => {
    setColorMode('dark');
  }, [setColorMode]);

  return (
    <Center h="100vh" ps="3rem" pe="3rem" flexDirection="column" {...props}>
      <Image mb="3rem" w="12rem" src={source} />
      <Text alignSelf="center" mb="1.5rem" fontSize="l">Built on <b>{CHAIN_ID === 5 ? 'Goerli' : 'Gnosis Chain'}</b>.</Text>
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
        Sign Up / Log In
      </Button>
      <Text mb="1.5rem" fontSize="xl">or</Text>
      <Button 
        onClick={() => {
          setUser(newWallet());
        }}
        size="lg"
        minW="10rem"
      >
        Quick Start
      </Button>
    </Center>
  );
}