import * as React from 'react';
import { Flex, FlexProps } from '@chakra-ui/react';
import { useDefaultBg } from '../utils/theme';

export function FullScreenOverlay({ children, ...props }: FlexProps) {
  const bg = useDefaultBg();
  return (
    <Flex bg={bg} h="100vh" w="100%" position="absolute" {...props} flexDirection="column">
      {children}
    </Flex>
  );
}