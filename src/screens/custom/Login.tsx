import * as React from 'react';
import {
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
import { LoginInput } from '../../components/custom/LoginInput';

export function Login() {

  // default the app to dark mode
  const { setColorMode } = useColorMode();
  useEffect(() => {
    setColorMode('dark');
  }, [setColorMode]);
    
  // private key login
  const [ keyValue, setKeyValue ] = useState<string>();
  const { setUser } = useAppContext();

  // email passwordless login
  const [ emailValue, setEmailValue ] = useState<string>();
  const emailLogin = usePasswordlessLogIn();
  
  return (
    <Center h="100vh" ps="3.5rem" pe="3.5rem" flexDirection="column">
      <Text alignSelf="center" fontSize="4xl">Lua Wallet</Text>
      <Image mb="1rem" w="12rem" src={logo} />
      <LoginInput mb="3rem" onEmailValidation={setEmailValue} onKeyValidation={setKeyValue} />
      <Button 
        borderRadius='2rem'
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
        borderRadius='2rem'
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