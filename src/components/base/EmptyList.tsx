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
  emptyMessage: string;
  errorMessage?: string;
  refresh?: () => void;
}

/**
 * An empty list component, which takes a message, and optionally
 * a refresh function, which will cause a Refresh button to appear.
 * 
 * Intended to be used for empty list state or an error state, when
 * the data fails to load properly.
 */
export function EmptyList({emptyMessage, errorMessage, refresh, ...props}: Props) {
  return (
    <Center>
      <Flex minW="10rem" flexDirection="column" mt="5rem" alignItems="center" {...props}>
        <Text as="b" mb="1rem">{errorMessage ? errorMessage : emptyMessage}</Text>
        {refresh && <Divider mb="1rem" />}
        {refresh &&
            <Button 
              borderRadius='2rem'
              onClick={refresh}
              size="sm"
              colorScheme={errorMessage ? 'red' : 'blue'}>
                Refresh
            </Button>
        }
      </Flex>
    </Center>
  );
}