import * as React from 'react';
import {
  Button,
  Input,
  InputGroup,
  InputProps,
  InputRightElement
} from '@chakra-ui/react';
import { useState, ChangeEvent } from 'react';
import { ethers } from 'ethers';

interface Props extends InputProps {
    onKeyValidation: (key: string | undefined) => void;
}

export function PrivateKeyInput({ onKeyValidation, ...props }: Props) {
  const [show, setShow] = useState(false);
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
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    onKeyValidation(isValidKey(input) ? input : undefined);
    if (props.onChange) props.onChange(e);
  };
  const showError = !!props.value && !isValidKey(props.value.toString());
  
  return (
    <InputGroup size='md'>
      <Input
        placeholder='Private Key'
        {...props}
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        onChange={onChange}
        isInvalid={showError}
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={showHide}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}