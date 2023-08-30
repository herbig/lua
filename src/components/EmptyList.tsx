import * as React from 'react';
import {
  BoxProps,
  Button,
  Divider,
  Flex,
  Text,
  Center
} from '@chakra-ui/react';

interface Props extends BoxProps {
  message: string;
  refresh?: () => void;
}

export function EmptyList({message, refresh, ...props}: Props) {
  return (
    <Center>
      <Flex minW="10rem" flexDirection="column" mt="5rem" alignItems="center" {...props}>
        <Text as="b" mb="1rem">{message}</Text>
        {refresh && <Divider mb="1rem" />}
        {refresh &&
            <Button 
              onClick={refresh}
              size="sm"
              colorScheme='blue'>
                Refresh
            </Button>
        }
      </Flex>
    </Center>
  );
}