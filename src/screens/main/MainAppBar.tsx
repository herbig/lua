import * as React from 'react';
import {
  BoxProps
} from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa';
import { AppBar, AppBarButton } from '../../components/base/AppBar';

interface Props extends BoxProps {
  onSettingsClicked: () => void;
}

/**
 * The main app AppBar, which includes an action button
 * to show the settings screen.
 */
export function MainAppBar({ onSettingsClicked, ...props }: Props) {
  const buttons: AppBarButton[] = [
    {
      icon: FaUser,
      onClick: onSettingsClicked,
      ariaLabel: 'Settings'
    }
  ];
  return (
    <AppBar title='Lua' buttons={buttons} {...props} />
  );
}