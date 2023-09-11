import * as React from 'react';
import { ModalProps } from '@chakra-ui/react';
import { FullscreenModal } from './FullscreenModal';
import { useDisplayName } from '../../utils/eth';
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
      <UserHistory address={address} />
    </FullscreenModal>
  );
}