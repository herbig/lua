import { useColorModeValue } from '@chakra-ui/react';

export function useDefaultBg(): string {
  return useColorModeValue('white', 'gray.800');
}