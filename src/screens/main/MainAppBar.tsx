import * as React from 'react';
import {
  BoxProps
} from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa';
import { AppBar, AppBarButton } from '../../components/base/AppBar';
import { SettingsModal } from '../overlays/SettingsModal';
import { useUI } from '../../providers/UIProvider';

interface Props extends BoxProps {
  title: string;
}

/**
 * The main app AppBar, which includes an action button
 * to show the settings screen.
 */
export function MainAppBar({ title, ...props }: Props) {
  const { setCurrentModal } = useUI();
  const buttons: AppBarButton[] = [
    {
      icon: FaUser,
      onClick: () => { 
        setCurrentModal(
          <SettingsModal 
            onClose={() => {setCurrentModal(undefined);}}
            isOpen={true} />
        );
      },
      ariaLabel: 'Settings'
    }
  ];
  return (
    <AppBar title={title} buttons={buttons} {...props} />
  );
}