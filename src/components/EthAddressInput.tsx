import * as React from 'react';
import {
  BoxProps,
  Input
} from '@chakra-ui/react';
import { isAddress } from 'web3-validator';
import { useState, ChangeEvent } from 'react';

interface Props extends BoxProps {
    onAddressValidation: (address: string | undefined) => void;
}

export function EthAddressInput({ onAddressValidation, ...props }: Props) {
  const [value, setValue] = useState<string>();
  const validateAddress = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setValue(input);
    onAddressValidation(isAddress(input) ? input : undefined);
  };
  const showError = !!value && !isAddress(value);
  
  return (
    <Input
      isInvalid={showError}
      placeholder='0x000...000'
      onChange={validateAddress}
      {...props}
    />
  );
}