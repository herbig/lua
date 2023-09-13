import * as React from 'react';
import { useGetUserAvatar } from '../utils/users';
import { AvatarProps, Avatar } from '@chakra-ui/react';

interface Props extends Omit<AvatarProps, 'src'> {
    address: string;
}

export function UserAvatar({ address, ...props }: Props) {
  const imageUri = useGetUserAvatar(address);
  return (
    <Avatar {...props} src={imageUri ? imageUri : ''} />
  );
}