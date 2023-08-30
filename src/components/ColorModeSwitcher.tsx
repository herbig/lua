import * as React from 'react';
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  IconButtonProps
} from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

/**
 * An IconButton component to change between light / dark mode.
 */
export function ColorModeSwitcher({ ...props } : Omit<IconButtonProps, 'aria-label'>) {
  const { toggleColorMode } = useColorMode();
  const nextMode = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <IconButton
      size='md'
      fontSize="lg"
      variant="ghost"
      color="current"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      aria-label={`Switch to ${nextMode} mode`}
      {...props}
    />
  );
}
