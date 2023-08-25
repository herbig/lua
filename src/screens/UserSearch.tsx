import * as React from 'react';
import {
  Box,
  BoxProps,
  Center
} from '@chakra-ui/react';

export function UserSearch({...props}: BoxProps) {
  return (
    <Center h="100vh" flexDirection="column" {...props}>
      <Box flex="1"></Box>
    </Center>
  );
}