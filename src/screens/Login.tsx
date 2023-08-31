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

export function Login({...props}: BoxProps) {
  const { setUser } = useAppContext();
  const [ keyInput, setKeyInput ] = useState<string>();
  const { setColorMode } = useColorMode();
  
  // default the app to dark mode
  useEffect(() => {
    setColorMode('dark');
  }, [setColorMode]);

  return (
    <Center h="100vh" ps="3rem" pe="3rem" flexDirection="column" {...props}>
      <Image mb="3rem" w="12rem" src={source} />
      <Text mb="1.5rem" fontSize="l">This demo is built on the Goerli testnet. DO NOT use an account on which you hold real assets.</Text>
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