import * as React from 'react';
import { Input, InputProps } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface Props extends InputProps {
    onKeyValidation: (key: string | undefined) => void;
    onEmailValidation: (email: string | undefined) => void;
}

/**
 * An Input component which handles validating an Ethereum private key
 * or email address.
 */
export function LoginInput({ onKeyValidation, onEmailValidation, ...props }: Props) {
  const [value, setValue] = useState<string>('');
  
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setValue(input.replace(' ', '').toLowerCase());
  };

  useEffect(() => {
    onKeyValidation(isValidKey(value) ? value : undefined);
    onEmailValidation(isValidEmail(value) ? value : undefined);
  }, [onEmailValidation, onKeyValidation, value]);

  const isInvalid = !!value && !(isValidKey(value) || isValidEmail(value));
  
  return (
    <Input
      {...props}
      id="loginId"
      value={value}
      placeholder='Email or Private Key'
      onChange={onChange}
      isInvalid={isInvalid}
    />
  );
}

const emailValidation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const isValidEmail = (email: string): boolean => {
  return emailValidation.test(email);
};

const isValidKey = (key: string): boolean => {
  try {
    new ethers.Wallet(key);
    return true;
  } catch (e) {
    return false;
  }
};