import * as React from 'react';
import { BoxProps, CircularProgress, Center } from '@chakra-ui/react';

export function DataLoading({ ...props }: BoxProps) {
  return (
    <Center mt="10rem" {...props}>
      <CircularProgress size='4rem' isIndeterminate />
    </Center>
  );
}