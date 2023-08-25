import * as React from 'react';
import {
  BoxProps,
  Button,
  Center,
  Flex,
  Image,
  Text
} from '@chakra-ui/react';
import { PrivateKeyInput } from '../components/PrivateKeyInput';
import { useAppContext } from '../AppProvider';
import { useState } from 'react';
import source from '../assets/logo192.png';

export function Login({ ...props }: BoxProps) {
  const { setUser } = useAppContext();
  const [ keyInput, setKeyInput ] = useState<string | undefined>(undefined);
  
  return (
    <Center {...props} h="100vh">
      <Flex p="3rem" pb="10rem" alignItems="center" flexDirection="column">
        <Image mb="3rem" w="15rem" src={source} />
        <Text mb="3rem" fontSize="xl">Input a Goerli private key to log in. This app is for demo purposes only, please DO NOT use an account on which you hold real funds on other chains.</Text>
        <PrivateKeyInput mb="2rem" onKeyValidation={(privateKey) => {
          setKeyInput(privateKey);
        }} />
        <Button isDisabled={keyInput === undefined} onClick={() => {
          setUser(keyInput);
        }}>
        Log In
        </Button>
      </Flex>
    </Center>
  );
}