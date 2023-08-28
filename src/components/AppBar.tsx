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

export const APPBAR_HEIGHT = '4rem';
export const APPBAR_PAD = '1.25rem';

export interface AppBarButton {
  icon: IconType;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

interface Props extends BoxProps {
  backClick?: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;
  buttons?: AppBarButton[];
}

export function AppBar({backClick, title, buttons, ...props}: Props) {
  return (
    <Flex direction="column" h={APPBAR_HEIGHT} {...props}>
      <Flex h="100%" ps={APPBAR_PAD} pe={APPBAR_PAD} alignItems="center">
        {backClick && <IconButton onClick={backClick} ms="-1rem" variant="ghost" icon={<FaArrowLeft />} aria-label={''} />}
        {title && <Text ms={backClick ? '0.25rem' : '0rem'} as="b">{title}</Text>}
        <Spacer />
        {buttons?.map((button, index) => {
          return (
            <IconButton key={index} me={index === buttons.length - 1 ? '-1rem' : '0rem'} onClick={button.onClick} variant="ghost" icon={<button.icon />} aria-label={''} />
          );
        })}
      </Flex>
      <Divider />
    </Flex>
  );
}