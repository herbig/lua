import * as React from 'react';
import {
  BoxProps,
  Divider,
  Flex,
  Spacer,
  Text
} from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa';

export const APPBAR_HEIGHT = '4rem';

export function AppBar({ ...props }: BoxProps) {
  return (
    <Flex {...props} direction="column" h={APPBAR_HEIGHT}>
      <Flex h="100%" ps="1rem" pe="1rem" alignItems="center">
        <Text as="b">Lua</Text>
        <Spacer />
        <FaUser />
      </Flex>
      <Divider />
    </Flex>
  );
}