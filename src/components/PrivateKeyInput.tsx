import * as React from 'react';
import {
  BoxProps,
  Button,
  Input,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { useState } from 'react';
import { ethers } from 'ethers';

interface Props extends BoxProps {
    onKeyValidation: (key: string | undefined) => void;
}

export function PrivateKeyInput({ onKeyValidation, ...rest }: Props) {
  const [show, setShow] = useState(false);
  const showHide = () => setShow(!show);
  const validateKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length === 64) {
      try {
        new ethers.Wallet(value);
        onKeyValidation(value);
      } catch (e) {
        onKeyValidation(undefined);
      }
    } else {
      onKeyValidation(undefined);
    }
  };
  
  return (
    <InputGroup {...rest} size='md'>
      <Input
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        placeholder='Private Key'
        onChange={validateKey}
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={showHide}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}