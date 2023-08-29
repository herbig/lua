
import { useColorModeValue, useToast } from '@chakra-ui/react';

export function useDefaultBg(): string {
  return useColorModeValue('white', 'gray.800');
}

export function useAppToast() {
  const t = useToast({
    duration: 3000,
    isClosable: false
  });
  const toast = (message: string, isError?: boolean) => {
    t({
      description: message,
      status: isError ? 'error' : 'info'
    });
  };
  return toast;
}