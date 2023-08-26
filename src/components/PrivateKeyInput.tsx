import * as React from 'react';
import {
  BoxProps,
  Button,
  Input,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { useState, ChangeEvent } from 'react';
import { ethers } from 'ethers';

interface Props extends BoxProps {
    onKeyValidation: (key: string | undefined) => void;
}

export function PrivateKeyInput({ onKeyValidation, ...props }: Props) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState<string>();
  const showHide = () => setShow(!show);
  const isValidKey = (key: string): boolean => {
    if (key.length === 64) {
      try {
        new ethers.Wallet(key);
        return true;
      } catch (e) {
        //
      }
    }
    return false;
  };
  const validateInput = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setValue(input);
    onKeyValidation(isValidKey(input) ? input : undefined);
  };
  const showError = !!value && !isValidKey(value);
  
  return (
    <InputGroup size='md' {...props}>
      <Input
        isInvalid={showError}
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        placeholder='Private Key'
        onChange={validateInput}
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={showHide}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}