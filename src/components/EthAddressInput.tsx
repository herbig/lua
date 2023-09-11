import * as React from 'react';
import {
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FaQrcode } from 'react-icons/fa';
import { QRScanModal } from './modals/QRScanModal';
import { useUsernameToAddress } from '../utils/eth';

interface Props extends Omit<InputProps, 'onChange'> {
    /**
     * Called whenever the input field changes, and passes back the input value
     * if it is a valid Eth address, or undefined if it is not.
     */
    onAddressValidation: (address: string | undefined) => void;
    
    setValue: Dispatch<SetStateAction<string>>
}

/**
 * An Input component which handles validating an input Ethereum address,
 * as well as allowing for opening a QR code scanner to scan a code
 * and place the result into the input field if it is a valid address.
 */
export function EthAddressInput({ onAddressValidation, setValue, ...props }: Props) {
  const { address } = useUsernameToAddress(props.value?.toString() || '');
  
  useEffect(() => {
    onAddressValidation(address);
  }, [address, onAddressValidation]);

  const showError = !!props.value && !address;
  const [showScan, setShowScan] = useState<boolean>(false);
  
  return (
    <InputGroup size='md'>
      <Input
        id='address'
        value={props.value}
        autoComplete="off"
        placeholder='Address or @username'
        {...props}
        onChange={(e) => {
          setValue(e.target.value);
        }}
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
