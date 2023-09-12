import * as React from 'react';
import { Input, InputProps } from '@chakra-ui/react';
import { ChangeEvent } from 'react';
import { ethers } from 'ethers';

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

interface Props extends InputProps {
    onKeyValidation: (key: string | undefined) => void;
    onEmailValidation: (email: string | undefined) => void;
}

/**
 * An Input component which handles validating an Ethereum private key
 * or email address.
 */
export function LoginInput({ onKeyValidation, onEmailValidation, ...props }: Props) {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    onKeyValidation(isValidKey(input) ? input : undefined);
    onEmailValidation(isValidEmail(input) ? input : undefined);
    if (props.onChange) props.onChange(e);
  };
  const showError = !!props.value && 
    !(isValidKey(props.value.toString()) || isValidEmail(props.value.toString()));
  
  return (
    <Input
      id="loginId"
      placeholder='Email Address or Private Key'
      {...props}
      onChange={onChange}
      isInvalid={showError}
    />
  );
}