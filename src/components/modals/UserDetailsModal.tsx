import * as React from 'react';
import { Text, Divider, ModalProps, Flex, Spacer } from '@chakra-ui/react';
import { FullscreenModal } from './FullscreenModal';
import { UserHistory } from '../UserHistory';
import { APPBAR_HEIGHT } from '../AppBar';
import { useDisplayName } from '../../utils/users';
import { UserAvatar } from '../UserAvatar';

interface Props extends Omit<ModalProps, 'children'> {
    address: string;
}

export const HERO_HEIGHT = '12rem';
export const LIST_HEIGHT = `calc(100vh - ${APPBAR_HEIGHT} - ${HERO_HEIGHT})`;

export function UserDetailsModal({ address, ...props }: Props) {
  const displayName = useDisplayName(address);

  return (
    <FullscreenModal 
      title={''}
      {...props}>
      <Flex alignItems='center' flexDirection='column' pt='2rem' h={HERO_HEIGHT}>
        <Spacer />
        <UserAvatar
          w="5rem"
          h="5rem"
          address={address}
        />
        <Text fontSize='2xl' as='b'>{displayName}</Text>
        <Spacer />
        <Divider mt='2rem' />
      </Flex>
      <UserHistory h={LIST_HEIGHT} address={address} />
    </FullscreenModal>
  );
}