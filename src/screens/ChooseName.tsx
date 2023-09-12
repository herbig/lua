import * as React from 'react';
import { BoxProps, Button, Flex, Input, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useUsernameToAddress, useRegisterUsername, isValidUsername } from '../utils/eth';
import { useAppToast } from '../utils/ui';
import { AppBar } from '../components/AppBar';

export function ChooseName({ ...props }: BoxProps) {
  const [input, setInput] = useState<string>('');
  const { address } = useUsernameToAddress(input);
  const { registerName } = useRegisterUsername();
  const toast = useAppToast();

  const clickSubmit = () => {
    if (address) {
      toast('Username taken!');
    } else {
      registerName(input);
    }
  };
    
  return (
    <Flex h="100vh" flexDirection="column" {...props}>
      <AppBar title='Register Username' />
      <VStack p="4rem" gap="1.5rem">
        <Text fontSize='xl' as='b' alignSelf="start">It&apos;s time to choose a name!</Text>
        <Text>Your username cannot be changed, so choose wisely. </Text> 
        <Text>You may use letters, numbers, and underscores, and must use at least 6 characters.</Text>
        <Input
          id='name'
          value={input}
          autoComplete="off"
          onChange={(e) => {
            setInput(e.target.value.toLowerCase().replace(' ', ''));
          }}
        />
        <Button 
          isDisabled={!isValidUsername(input)} 
          mt="1rem"
          size="lg"
          minW="10rem"
          colorScheme='blue'
          onClick={clickSubmit}>
            Submit
        </Button>
      </VStack>
    </Flex>
  );
}