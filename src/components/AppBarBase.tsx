import * as React from 'react';
import {
  BoxProps,
  Divider,
  Flex
} from '@chakra-ui/react';

export const APPBAR_HEIGHT = '4rem';
export const APPBAR_PAD = '1.5rem';

export function AppBarBase({...props}: BoxProps) {
  return (
    <Flex direction="column" h={APPBAR_HEIGHT} {...props}>
      <Flex h="100%" ps={APPBAR_PAD} pe={APPBAR_PAD} alignItems="center">
        {props.children}
      </Flex>
      <Divider />
    </Flex>
  );
}