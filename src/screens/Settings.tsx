import * as React from 'react';
import { Button, Divider, BoxProps, Flex, Text } from '@chakra-ui/react';
import { useAppContext } from '../AppProvider';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';
import { useDefaultBg } from '../utils/theme';
import { AppBar } from '../components/AppBar';

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
      <AppBar backClick={onBackClicked} title='Settings' />
      <Button onClick={() => {
        setUser(undefined);
      }}>
        Log Out
      </Button>
      <Divider mt="1rem" mb="1rem" />
      <ColorModeSwitcher />
      <Text>TODO:</Text>
      <Text>wallet balance</Text>
      <Text>wallet address</Text>
      <Text>private key (show/hide)</Text>
    </Flex>
  );
}