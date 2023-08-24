import * as React from 'react'
import {
  BoxProps,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ethers } from 'ethers';

interface Props extends BoxProps {
    onKeyValidation: (key: string | undefined) => void;
}

export function PrivateKeyInput({ ...props }: Props) {
  const [show, setShow] = useState(false)
  const showHide = () => setShow(!show)
  const validateKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length === 64 && value.startsWith('0x')) {
      try {
        new ethers.Wallet(value);
      } catch (e) {
        props.onKeyValidation(undefined);
      }
    } else {
      props.onKeyValidation(undefined);
    }
  };
  
  return (
    <InputGroup {...props} size='md'>
      <Input
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        placeholder='Enter Private Key'
        onChange={validateKey}
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={showHide}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}