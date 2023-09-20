import * as React from 'react';
import { Text, Divider, ModalProps, Flex, Spacer } from '@chakra-ui/react';
import { UserAvatar } from '../../components/avatars/UserAvatar';
import { APPBAR_HEIGHT } from '../../components/base/AppBar';
import { FullscreenModal } from '../../components/modals/base/FullscreenModal';
import { useDisplayName } from '../../utils/contracts/usernames';
import { HistoryDataList } from '../../components/custom/HistoryDataList';

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
          mb='0.5rem'
          address={address}
        />
        <Text fontSize='2xl' as='b'>{displayName}</Text>
        <Spacer />
        <Divider mt='2rem' />
      </Flex>
      <HistoryDataList h={LIST_HEIGHT} userAddress={address} />
    </FullscreenModal>
  );
}