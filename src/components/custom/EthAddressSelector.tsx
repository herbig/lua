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
import { useUsernameToAddress } from '../../utils/contracts/usernames';
import { QRScanModal } from '../../screens/overlays/QRScanModal';
import { UserSelectionModal } from '../../screens/overlays/UserSelectionModal';

interface Props extends Omit<InputProps, 'onChange'> {
    /**
     * Called whenever the input field changes, and passes back the input value
     * if it is a valid Eth address, or undefined if it is not.
     */
    onAddressValidation: (address: string | undefined) => void;
    
    setValue: Dispatch<SetStateAction<string>>
}

export function EthAddressSelector({ onAddressValidation, setValue, ...props }: Props) {
  
  const { address } = useUsernameToAddress(props.value?.toString() || '');
  
  useEffect(() => {
    onAddressValidation(address);
  }, [address, onAddressValidation]);

  const [showScan, setShowScan] = useState<boolean>(false);
  const [showSelector, setShowSelector] = useState<boolean>(false);
  
  return (
    <InputGroup size='md'>

      <Input
        id='recipientId'
        borderRadius='2rem'
        value={props.value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder='@username or Wallet Address'
        isInvalid={!!props.value && !address}
        onClick={() => {
          setValue('');
          setShowSelector(true);
        }}
        {...props}
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
        onDecode={(user: string) => {
          setValue(user);
        }} />

      <UserSelectionModal 
        isOpen={showSelector}
        onClose={() => {
          setShowSelector(false);
        }} 
        onSelection={(user: string) => {
          setValue(user);
        }} />
    </InputGroup>
  );
}
