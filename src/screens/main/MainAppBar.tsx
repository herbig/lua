import * as React from 'react';
import {
  BoxProps,
  IconButton,
  Spacer
} from '@chakra-ui/react';
import { FaQrcode, FaUser } from 'react-icons/fa';
import { AppBarBase } from '../../components/AppBarBase';

interface Props extends BoxProps {
  onStartIconClicked: () => void;
  onEndIconClicked: () => void;
}

export function MainAppBar({ onStartIconClicked, onEndIconClicked, ...props }: Props) {
  return (
    <AppBarBase {...props}>
      <IconButton ms="-1rem" onClick={onStartIconClicked} variant="ghost" icon={<FaQrcode />} aria-label={''} />
      <Spacer />
      <IconButton me="-1rem" onClick={onEndIconClicked} variant="ghost" icon={<FaUser />} aria-label={''} />
    </AppBarBase>
  );
}