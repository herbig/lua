import * as React from 'react';
import { Box, Image, Text, BoxProps, Flex, VStack } from '@chakra-ui/react';
import { AppBar } from '../../components/base/AppBar';
import install from '../../assets/install.png';

export function InstallPromptBlocker({ ...props }: BoxProps) {
  return (
    <Flex h='100vh' flexDirection="column" {...props}>
      <AppBar title='Lua Wallet' />
      <VStack p="2rem" gap="1.7rem" alignItems='start'>
        <Text as='b' fontSize='2xl'>Welcome!</Text>
        <Text fontSize='xl'>You&#8217;ve stumbled upon the future of finance.  But it&#8217;s only for mobile.</Text>
        <Text fontSize='xl'>Lua Wallet is optimized for installation as an app outside your browser.</Text>
        <Text fontSize='xl'>You can install it via your browser&#8217;s settings, something like this:</Text>
        <Box borderColor='blue.800' borderWidth='1px'><Image src={install} /></Box>
      </VStack>
    </Flex>
  );
}

export function isPWA() {
  return document.referrer.startsWith('android-app://') 
    || window.matchMedia('(display-mode: standalone)').matches;
}