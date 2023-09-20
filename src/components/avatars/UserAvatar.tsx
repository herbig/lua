import * as React from 'react';
import { AvatarProps, Avatar, useColorModeValue } from '@chakra-ui/react';
import { useGetUserValue } from '../../utils/contracts/usernames';

interface Props extends Omit<AvatarProps, 'src'> {
    address: string;
}

export function UserAvatar({ address, ...props }: Props) {
  const imageUri = useGetUserValue(address, 'avatar_img');
  const bg = useColorModeValue('gray.400', 'gray.500');
  // backgroundColor is set to avoid a weird bug
  // where the bg color disappears after the history
  // list is updated...
  return (
    <Avatar {...props} backgroundColor={bg} ignoreFallback={true} src={imageUri ? imageUri : undefined} />
  );
}