import * as React from 'react';
import { Button, Divider, BoxProps, Flex } from '@chakra-ui/react';
import { useAppContext } from '../AppProvider';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';
import { SettingsAppBar } from './SettingsAppBar';
import { useDefaultBg } from '../utils/theme';

interface Props extends BoxProps {
  onBackClicked: () => void;
}

export function Settings({ onBackClicked, ...props }: Props) {
  const { setUser } = useAppContext();

  // settings is overlaid on top of the main app content,
  // so requires an explicit background color set
  const bg = useDefaultBg();
  
  return (
    <Flex bg={bg} flexDirection="column" h="100vh" w="100%" {...props}>
      <SettingsAppBar onBackClicked={onBackClicked} mb="2rem" />
      <Button onClick={() => {
        setUser(undefined);
      }}>
        Log Out
      </Button>
      <Divider mt="1rem" mb="1rem" />
      <ColorModeSwitcher />
    </Flex>
  );
}