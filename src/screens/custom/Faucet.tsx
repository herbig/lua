import * as React from 'react';
import { Text, Button, BoxProps, Flex, VStack } from '@chakra-ui/react';
import { AppBar } from '../../components/base/AppBar';
import { useFaucet } from '../../utils/eth';
import { CHAIN } from '../../utils/chains';

export function Faucet({ ...props }: BoxProps) {
  const { tap } = useFaucet();
  return (
    <Flex h='100vh' flexDirection="column" {...props}>
      <AppBar title='Welcome (1 of 2)' />
      <VStack p="2rem" gap="1.7rem" alignItems='start'>
        <Text as='b' fontSize='2xl'>Welcome to Lua Wallet!</Text>
        <Text fontSize='xl'>Lua uses real money called <b>{CHAIN.ethName}</b> on the decentralized blockchain <b>{CHAIN.chainName}</b>.</Text>
        <Text fontSize='xl'>Sending cash costs a small fee (about $0.0003), so a few cents should power a whole year!</Text>
        <Text fontSize='xl'>We always keep your balance at $0.01 just to be sure.</Text>
        <Text fontSize='xl'>Let&#8217;s get you started to check it out!</Text>
        <Button 
          borderRadius='2rem'
          size="lg"
          alignSelf='center'
          minW="10rem"
          colorScheme='blue'
          onClick={() => {
            tap();
          }}>
        Get $0.25 free
        </Button>
      </VStack>
    </Flex>
  );
}