import * as React from 'react';
import { AvatarProps, Avatar } from '@chakra-ui/react';
import { useGetUserValue } from '../../utils/users';

interface Props extends Omit<AvatarProps, 'src'> {
    address: string;
}

export function UserAvatar({ address, ...props }: Props) {
  const imageUri = useGetUserValue(address, 'avatar_img');
  return (
    <Avatar {...props} ignoreFallback={true} src={imageUri ? imageUri : undefined} />
  );
}