import * as React from 'react';
import { Box, ModalProps } from '@chakra-ui/react';
import { FullscreenModal } from './FullscreenModal';
import { useDisplayName } from '../../utils/eth';
import { APPBAR_HEIGHT } from '../AppBar';
import { UserHistory } from '../UserHistory';

interface Props extends Omit<ModalProps, 'children'> {
    address: string;
}

export function UserDetailsModal({ address, ...props }: Props) {
  const displayName = useDisplayName(address);

  return (
    <FullscreenModal 
      title={displayName}
      {...props}>
      <Box h={`calc(100vh - ${APPBAR_HEIGHT})`} overflowY="auto">   
        <UserHistory address={address} />
      </Box>
    </FullscreenModal>
  );
}