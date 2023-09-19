import * as React from 'react';
import {
  BoxProps
} from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa';
import { AppBar, AppBarButton } from '../../components/base/AppBar';
import { useState } from 'react';
import { SettingsModal } from '../overlays/SettingsModal';

interface Props extends BoxProps {
  title: string;
}

/**
 * The main app AppBar, which includes an action button
 * to show the settings screen.
 */
export function MainAppBar({ title, ...props }: Props) {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const buttons: AppBarButton[] = [
    {
      icon: FaUser,
      onClick: () => { setShowSettings(true); },
      ariaLabel: 'Settings'
    }
  ];
  return (
    <AppBar title={title} buttons={buttons} {...props}>
      {showSettings && 
        <SettingsModal 
          onClose={() => {setShowSettings(false);}}
          isOpen={showSettings} />
      }
    </AppBar>
  );
}