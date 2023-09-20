import * as React from 'react';
import { BoxProps, Button, Flex, Input, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useAppToast } from '../../utils/ui';
import { AppBar } from '../../components/base/AppBar';
import { useUsernameToAddress, useRegisterUsername, isValidUsername } from '../../utils/contracts/usernames';

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
      <AppBar title='Choose Name (2 of 2)' />
      <VStack p="2rem" gap="1.7rem" alignItems='start'>
        <Text fontSize='2xl' as='b'>It&apos;s time to choose a name!</Text>
        <Text fontSize='xl'>Your username cannot be changed, so choose wisely. </Text> 
        <Text fontSize='xl'>You may use letters, numbers, and underscores, and must use at least 6 characters.</Text>
        <Input
          id='name'
          borderRadius='2rem'
          placeholder='username'
          value={input}
          autoComplete="off"
          onChange={(e) => {
            setInput(e.target.value.toLowerCase().replace(' ', ''));
          }}
        />
        <Button 
          isDisabled={!isValidUsername(input)} 
          alignSelf='center'
          borderRadius='2rem'
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