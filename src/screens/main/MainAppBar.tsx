import * as React from 'react';
import {
  BoxProps
} from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa';
import { AppBar, AppBarButton } from '../../components/AppBar';

interface Props extends BoxProps {
  onSettingsClicked: () => void;
}

export function MainAppBar({ onSettingsClicked, ...props }: Props) {
  const buttons: AppBarButton[] = [
    {
      icon: FaUser,
      onClick: onSettingsClicked
    }
  ];
  return (
    <AppBar title='Lua' buttons={buttons} {...props} />
  );
}