import * as React from 'react';
import { Button, Divider, BoxProps, Flex, useColorModeValue } from '@chakra-ui/react';
import { useAppContext } from '../AppProvider';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';
import { SettingsAppBar } from './SettingsAppBar';

interface Props extends BoxProps {
  onBackClicked: () => void;
}

export function Settings({ onBackClicked, ...rest }: Props) {
  const { setUser } = useAppContext();
  const bg = useColorModeValue('white', 'gray.800');
  
  return (
    <Flex bg={bg} {...rest} flexDirection="column" h="100vh" w="100%">
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