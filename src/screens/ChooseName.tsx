import * as React from 'react';
import { BoxProps, Button, Flex, Input, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useNameToAddress, useRegisterName, validName } from '../utils/eth';
import { useAppToast } from '../utils/ui';
import { AppBar } from '../components/AppBar';

export function ChooseName({ ...props }: BoxProps) {
  const [input, setInput] = useState<string>('');
  const { address } = useNameToAddress(input);
  const { registerName } = useRegisterName();
  const toast = useAppToast();

  const clickSubmit = () => {
    if (!validName(input)) {
      toast('Invalid name.');
    } else if (address) {
      toast('Name taken!');
    } else {
      registerName(input);
    }
  };
    
  return (
    <Flex h="100vh" flexDirection="column" {...props}>
      <AppBar title='Register Name' />
      <VStack p="4rem" gap="1.5rem">
        <Text fontSize='xl' as='b' alignSelf="start">It&apos;s time to choose a name!</Text>
        <Text>Your username cannot be changed, so choose wisely. </Text> 
        <Text>You may use numbers, lowercase letters, or underscores, and must use at least 6 characters.</Text>
        <Input
          id='name'
          autoComplete="off"
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <Button 
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