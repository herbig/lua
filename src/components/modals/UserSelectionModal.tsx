import * as React from 'react';
import { Text, Box, Flex, ModalProps, HStack, Input } from '@chakra-ui/react';
import { FullscreenModal } from './FullscreenModal';
import { APP_DEFAULT_H_PAD } from '../../screens/main/AppRouter';
import { useEffect, useState } from 'react';
import { useAddressToUsername, useDisplayName, useUsernameToAddress } from '../../utils/users';
import { ClickablSpace } from '../ClickableSpace';
import { getFriends } from '../../utils/friends';
import { UserAvatar } from '../UserAvatar';

/**
 * An Input component which handles validating an input Ethereum address.
 */
function EthAddressInput({ onAddressValidation }: {
  onAddressValidation: (address: string | undefined) => void}) {

  const [value, setValue] = useState<string>('');
  const { address } = useUsernameToAddress(value);

  useEffect(() => {
    onAddressValidation(address);
  }, [address, onAddressValidation, value]);

  return (
    <Input
      id='addressInput'
      value={value}
      onChange={(e) => {
        setValue(e.target.value.replace(' ', '').toLowerCase());
      }}
      autoFocus
      autoComplete="off"
      placeholder='@username or User ID'
      isInvalid={!!value && !address}
    />
  );
}

function UserRow({ address, onClick } : { address: string, onClick: () => void }) {
  
  const displayName = useDisplayName(address);

  return (
    <ClickablSpace onClick={onClick} pt="1rem" pb="1rem" ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD} h="5rem" alignItems="center">
      <HStack w='100%'>
        <UserAvatar
          w="2.5rem"
          h="2.5rem"
          address={address}
        />
        <Text fontSize='lg' as="b" ms='0.5rem'>{displayName}</Text>
      </HStack>
    </ClickablSpace>
  );
}

interface Props extends Omit<ModalProps, 'children'> {
  onSelection: (user: string) => void;
}

export function UserSelectionModal({ onSelection, ...props }: Props) {
  const [address, setAddress] = useState<string>();
  const { username } = useAddressToUsername(address);
  const friends = getFriends();

  return (
    <FullscreenModal 
      title='Choose Recipient' 
      {...props}>
      <Flex flexDirection="column" pt="1rem">      
        
        <Box ms={APP_DEFAULT_H_PAD} me={APP_DEFAULT_H_PAD}>
          <EthAddressInput onAddressValidation={setAddress} />
        </Box>
        
        {(address && username) && 
          <UserRow
            address={address}
            onClick={() => {
              onSelection(username);
              props.onClose();
              setAddress(undefined);
            }} />
        }

        <Text mt='1rem' ms={APP_DEFAULT_H_PAD} as='b'>Recent Users</Text>

        {friends.map((friend, index) => {
          return (
            <Box key={index}>
              {
                friend.address !== address ?
                  <UserRow
                    address={friend.address}
                    onClick={() => {
                      onSelection(friend.address);
                      props.onClose();
                      setAddress(undefined);
                    }} />
                  :
                  null
              }
            </Box>
          );
        })}
          
      </Flex>
    </FullscreenModal>
  );
}