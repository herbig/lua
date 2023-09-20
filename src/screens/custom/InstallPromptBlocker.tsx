import * as React from 'react';
import { Box, Image, Text, BoxProps, VStack, useColorMode } from '@chakra-ui/react';
import install from '../../assets/install.png';
import { useEffect } from 'react';

export function InstallPromptBlocker({ ...props }: BoxProps) {
  // default the app to dark mode
  const { setColorMode } = useColorMode();
  useEffect(() => {
    setColorMode('dark');
  }, [setColorMode]);
    
  return (
    <VStack p="2rem" h='100vh' gap="1.2rem" alignItems='start' {...props}>
      <Text as='b' fontSize='2xl'>Welcome!</Text>
      <Text fontSize='xl'>You&#8217;ve stumbled upon the future of finance. But it&#8217;s only for mobile.</Text>
      <Text fontSize='xl'>Lua Wallet is optimized for installation as an app outside your browser.</Text>
      <Text fontSize='xl'>You can do so via your browser&#8217;s settings, something like this:</Text>
      <Box borderColor='blue.800' borderWidth='1px'><Image src={install} /></Box>
    </VStack>
  );
}

export function isPWA() {
  return document.referrer.startsWith('android-app://') 
    || window.matchMedia('(display-mode: standalone)').matches;
}