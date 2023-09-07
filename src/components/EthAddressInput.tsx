import * as React from 'react';
import {
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaQrcode } from 'react-icons/fa';
import { QRScanModal } from './modals/QRScanModal';
import { useNameToAddress } from '../utils/eth';

interface Props extends Omit<InputProps, 'onChange'> {
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
export function EthAddressInput({ onAddressValidation, ...props }: Props) {
  const [input, setInput] = useState<string>('');
  const { address } = useNameToAddress(input);
  
  useEffect(() => {
    onAddressValidation(address);
  }, [address, onAddressValidation]);

  const showError = !!props.value && !address;
  const [showScan, setShowScan] = useState<boolean>(false);
  
  return (
    <InputGroup size='md'>
      <Input
        id='address'
        value={input}
        autoComplete="off"
        placeholder='0x000...000'
        {...props}
        onChange={(e) => {
          setInput(e.target.value);
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
            setInput('');
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
          console.log('address' + address);
          setInput(address);
        }} />
    </InputGroup>
  );
}
