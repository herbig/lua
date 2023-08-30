import * as React from 'react';
import {
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement
} from '@chakra-ui/react';
import { isAddress } from 'web3-validator';
import { ChangeEvent, useState } from 'react';
import { FaQrcode } from 'react-icons/fa';
import { QRScanModal } from './modals/QRScanModal';

interface Props extends Omit<InputProps, 'onChange'> {
    /** 
     * A stateful function that determines the value of the input 
     * 
     * EthAddressInput does not use onChange, instead all the functionality
     * is managed via the value setter provided by the component that renders it. 
     */
    setValue: React.Dispatch<React.SetStateAction<string>>;

    /**
     * Called whenever the input field changes, and passes back the input value
     * if it is a valid Eth address, or undefined if it is not.
     */
    onAddressValidation: (address: string | undefined) => void;
}

/**
 * An Input component which handles validating an input Ethereum address,
 * as well as allowing for opening a QR code scanner to scan a code
 * and place the result into the input field if it is a valid address.
 */
export function EthAddressInput({ setValue, onAddressValidation, ...props }: Props) {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setValue(input);
    // TODO checksum it
    onAddressValidation(isAddress(input) ? input : undefined);
  };
  const showError = !!props.value && !isAddress(props.value.toString());
  const [showScan, setShowScan] = useState<boolean>(false);
  
  return (
    <InputGroup size='md'>
      <Input
        id='address'
        autoComplete="off"
        placeholder='0x000...000'
        {...props}
        onChange={onChange}
        isInvalid={showError}
      />
      <InputRightElement width='4.5rem'>
        <IconButton
          size='sm'
          variant="ghost"
          marginLeft="2rem"
          icon={<FaQrcode />}
          onClick={() => {
            setValue('');
            setShowScan(true);
          }}
          aria-label=''
        />
      </InputRightElement>
      <QRScanModal 
        isOpen={showScan}
        onClose={() => {
          setShowScan(false);
        }} 
        onDecode={(address: string) => {
          setValue(address);
        }} />
    </InputGroup>
  );
}
