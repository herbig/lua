import * as React from 'react';
import {
  BoxProps,
  Button,
  Center,
  Flex,
  SimpleGrid,
  Text
} from '@chakra-ui/react';
import { useState } from 'react';
import { displayAmount } from '../utils/eth';

const APP_MAX = 9999;

interface Props extends BoxProps {
  accountMax: number;
  onNumberChanged: (amount: number) => void;
}

export function NumberPad({ onNumberChanged, accountMax, ...props }: Props) {
  const max = Math.min(APP_MAX, accountMax);
  const [amount, setAmount] = useState<string>('0');
  const changeAmount = (amount: string) => {
    const amountNum = Number(amount);
    if (amountNum >= max) {
      setAmount(max.toString());
      onNumberChanged(max);
    } else {
      setAmount(amount);
      onNumberChanged(amountNum);
    }
  };
  const onClickPad = (text: string) => {
    switch(text) {
    case '<':
      if (amount.length > 1) {
        changeAmount(amount.substring(0, amount.length - 1));
      } else {
        changeAmount('0');
      }
      break;
    case '.':
      if (!amount.includes('.')) {
        changeAmount(amount + text);
      }
      break;
    default:
      if (amount === '0') {
        changeAmount(text);
      } else if (amount.includes('.') && amount.length - amount.indexOf('.') > 2) {
        changeAmount(amount.substring(0, amount.length - 1) + text);
      } else {
        changeAmount(amount + text);
      }
    }
  };
  const numberPads: Array<string> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '<'];

  return (
    <Flex flexDirection='column' {...props} >
      <Center flex='1'>
        <Flex flexDirection="column" mb='3rem'>
          <Text fontSize='7xl' as='b'>${amount}</Text>
          <Text textAlign='center' fontSize='s' as='b'>(max {displayAmount(max)})</Text>
        </Flex>
      </Center>
      <SimpleGrid columns={3} spacing={4}>
        {numberPads.map((text, index) => {
          return (
            <Button 
              key={index}
              fontSize="3xl"
              variant="ghost"
              height='4rem'
              onClick={() => {
                onClickPad(text);
              }}>
              {text}
            </Button>
          );
        })}
      </SimpleGrid>
    </Flex>
  );
}