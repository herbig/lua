import * as React from 'react';
import {
  BoxProps,
  Divider,
  Flex,
  IconButton,
  Spacer,
  Text
} from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { IconType } from 'react-icons';

export const APPBAR_HEIGHT = '3.5rem';

/** An action button for the AppBar, appearing on the right. */
export interface AppBarButton {
  icon: IconType;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  ariaLabel: string;
}

interface Props extends BoxProps {
  backClick?: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;
  buttons?: AppBarButton[];
}

/**
 * A mobile "AppBar", modeled after Android's AppBar, but using Chakra
 * component.
 * 
 * The component allows an optional backClick function, which will cause
 * the left back or "up" arrow to appear, as well as a title for the screen.
 * 
 * An array of AppBarButton's can also optionally be provided, which will
 * be placed to the right of the screen.
 */
export function AppBar({backClick, title, buttons, ...props}: Props) {
  return (
    <Flex direction="column" h={APPBAR_HEIGHT} {...props}>
      <Flex h="100%" alignItems="center">
        {backClick && <IconButton onClick={backClick} ms='0.25rem' variant="ghost" icon={<FaArrowLeft />} aria-label={'Back'} />}
        {title && <Text ms={backClick ? '0.25rem' : '1.25rem'} as="b">{title}</Text>}
        <Spacer />
        {buttons?.map((button, index) => {
          return (
            <IconButton key={index} me={index === buttons.length - 1 ? '0.25rem' : '0rem'} onClick={button.onClick} variant="ghost" icon={<button.icon />} aria-label={button.ariaLabel} />
          );
        })}
      </Flex>
      <Divider />
    </Flex>
  );
}