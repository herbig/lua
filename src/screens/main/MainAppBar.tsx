import * as React from 'react';
import {
  BoxProps
} from '@chakra-ui/react';
import { FaQrcode, FaUser } from 'react-icons/fa';
import { AppBar, AppBarButton } from '../../components/AppBar';

interface Props extends BoxProps {
  onScanClicked: () => void;
  onSettingsClicked: () => void;
}

export function MainAppBar({ onScanClicked, onSettingsClicked, ...props }: Props) {
  const buttons: AppBarButton[] = [
    {
      icon: FaQrcode,
      onClick: onScanClicked
    },
    {
      icon: FaUser,
      onClick: onSettingsClicked
    }
  ];
  return (
    <AppBar title='Lua' buttons={buttons} {...props} />
  );
}