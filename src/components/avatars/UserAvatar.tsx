import * as React from 'react';
import { AvatarProps, Avatar } from '@chakra-ui/react';
import { useGetUserValue } from '../../utils/users';

interface Props extends Omit<AvatarProps, 'src'> {
    address: string;
}

export function UserAvatar({ address, ...props }: Props) {
  const imageUri = useGetUserValue(address, 'avatar_img');
  // backgroundColor is set to avoid a weird bug
  // where the bg color disappears after the history
  // list is updated...
  return (
    <Avatar {...props} backgroundColor='gray.400' ignoreFallback={true} src={imageUri ? imageUri : undefined} />
  );
}