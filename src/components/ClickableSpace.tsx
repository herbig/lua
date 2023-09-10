import * as React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

export function ClickablSpace({ children, ...props }: ButtonProps) {
  return (
    <Button
      h="100%"
      w="100%"
      variant="ghost"
      whiteSpace='normal'
      overflowWrap="break-word"
      textAlign="start"
      borderRadius='none'
      {...props}>
      {children}
    </Button>
  );
}