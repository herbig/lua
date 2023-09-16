import * as React from 'react';
import { Text, Box, Flex, ModalProps, HStack, Input } from '@chakra-ui/react';
import { UserAvatar } from '../../components/avatars/UserAvatar';
import { ClickablSpace } from '../../components/base/ClickableSpace';
import { FullscreenModal } from '../../components/modals/base/FullscreenModal';
import { getFriends } from '../../utils/friends';
import { useUsernameToAddress, useDisplayName, useAddressToUsername } from '../../utils/users';
import { APP_DEFAULT_H_PAD } from '../main/App';
import { useEffect, useState } from 'react';

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
      id='recipientId'
      borderRadius='2rem'
      type='search'
      value={value}
      onChange={(e) => {
        setValue(e.target.value.replace(' ', '').toLowerCase());
      }}
      autoFocus
      autoComplete="off"
      placeholder='@username or Wallet Address'
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
        
        {/* if we have an address AND we've checked for a corresponding username */}
        {(address && username !== undefined) &&
          <UserRow
            address={address}
            onClick={() => {
              onSelection(username ? username : address);
              props.onClose();
              setAddress(undefined);
            }} />
        }

        {friends.length > 0 &&<Text mt='1rem' ms={APP_DEFAULT_H_PAD} as='b'>Recent Users</Text>}

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