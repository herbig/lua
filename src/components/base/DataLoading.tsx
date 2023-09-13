import * as React from 'react';
import { BoxProps, CircularProgress, Center } from '@chakra-ui/react';

/**
 * A generic loading indicator component, intended to be used for 
 * the initial loading indicator for lists.
 */
export function DataLoading({ ...props }: BoxProps) {
  return (
    <Center mt="10rem" {...props}>
      <CircularProgress size='4rem' isIndeterminate />
    </Center>
  );
}