import * as React from 'react';
import {
  BoxProps,
  Divider,
  Flex
} from '@chakra-ui/react';

export const APPBAR_HEIGHT = '4rem';
export const APPBAR_PAD = '1.5rem';

export function AppBarBase({children, ...props }: BoxProps) {
  return (
    <Flex {...props} direction="column" h={APPBAR_HEIGHT}>
      <Flex h="100%" ps="1.5rem" pe="1.5rem" alignItems="center">
        {children}
      </Flex>
      <Divider />
    </Flex>
  );
}