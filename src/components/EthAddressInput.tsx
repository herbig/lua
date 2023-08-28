import * as React from 'react';
import {
  Input,
  InputProps
} from '@chakra-ui/react';
import { isAddress } from 'web3-validator';
import { ChangeEvent } from 'react';

interface Props extends InputProps {
    onAddressValidation: (address: string | undefined) => void;
}

export function EthAddressInput({ onAddressValidation, ...props }: Props) {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    onAddressValidation(isAddress(input) ? input : undefined);
    if (props.onChange) props.onChange(e);
  };
  const showError = !!props.value && !isAddress(props.value.toString());
  
  return (
    <Input
      id='address'
      autocomplete="off"
      placeholder='0x000...000'
      {...props}
      onChange={onChange}
      isInvalid={showError}
    />
  );
}