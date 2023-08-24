import * as React from 'react';
import {
  BoxProps,
  Button,
  Flex
} from '@chakra-ui/react';
import { PrivateKeyInput } from '../components/PrivateKeyInput';
import { useAppContext } from '../AppProvider';
import { useState } from 'react';

export function Login({ ...props }: BoxProps) {
  const { setUser } = useAppContext();
  const [ keyInput, setKeyInput ] = useState<string | undefined>(undefined);
  
  return (
    <Flex {...props} flexDirection="column">
      <PrivateKeyInput onKeyValidation={(privateKey) => {
        setKeyInput(privateKey);
      }} />
      <Button isDisabled={keyInput === undefined} onClick={() => {
        setUser(keyInput);
      }}>
        Submit
      </Button>
    </Flex>
  );
}