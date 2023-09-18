import * as React from 'react';
import {
  Box,
  BoxProps,
  Button,
  Center,
  Flex,
  HStack,
  SimpleGrid,
  Text
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ethDisplayAmount } from '../../utils/eth';

/**
 * The maximum amount the app will allow to be sent in a single 
 * transaction.
 */
const APP_MAX = 9999;

interface Props extends BoxProps {
  /**
   * The maximum the account can spend, usually the total amount in
   * the account.
   * 
   * With gas subsidizing via account abstraction, you should be able
   * to send the full amount.
   */
  accountMax: number;

  amount: number;

  setAmount: Dispatch<SetStateAction<number>>
}

/**
 * A NumberPad component, similar to Venmo or CashApp's method of inputting an
 * amount of USD to send to a given recipient.
 * 
 * Only a maximum amount and onNumberChanged callback are necessary, and
 * the utilizing component will get back the current number whenever the user
 * taps on the number pad.
 */
export function NumberPad({ accountMax, amount, setAmount, ...props }: Props) {
  const [amountString, setAmountString] = useState<string>('0');
  const changeAmount = (amount: string) => {
    const amountNum = Number(amount);
    if (amountNum >= APP_MAX) {
      setAmountString(APP_MAX.toString());
      setAmount(APP_MAX);
    } else {
      setAmountString(amount);
      setAmount(amountNum);
    }
  };

  const onClickPad = (character: string) => {
    switch(character) {
    case '<':
      if (amountString.length > 1) {
        changeAmount(amountString.substring(0, amountString.length - 1));
      } else if (amountString === '0') {
        navigator.vibrate(200);
      } else {
        changeAmount('0');
      }
      break;
    case '.':
      if (!amountString.includes('.')) {
        changeAmount(amountString + character);
      }
      break;
    default:
      if (character === '0' && amountString.startsWith('0.0')) {
        navigator.vibrate(200);
      } else if (amountString === '0') {
        changeAmount(character);
      } else if (amountString.includes('.') && amountString.length - amountString.indexOf('.') > 2) {
        navigator.vibrate(200);
      } else {
        changeAmount(amountString + character);
      }
    }
  };

  // handles changes to amount from outside this component
  // e.g. resetting to 0
  useEffect(() => {
    if (amount !== Number(amountString)) {
      setAmountString(amount.toString());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);
  
  const numberPads: Array<string> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '<'];

  return (
    <Flex flexDirection='column' {...props} >
      <Center flex='1'>
        <Flex flexDirection="column">
          <HStack alignSelf='center' ms='-2rem' mb='-1rem'>
            <Text fontSize='4xl' as='b'>$</Text>
            <Text fontSize='8xl' as='b'>{amountString}</Text>
          </HStack>
          <Box alignSelf='center' ms='-0.5rem'>
            <Button borderRadius='2rem' variant="ghost" size='md' onClick={() => {
              changeAmount(accountMax.toString());
            }}>
              of {ethDisplayAmount(accountMax)}
            </Button>
          </Box>
        </Flex>
      </Center>
      <SimpleGrid columns={3} spacing='0.3rem'>
        {numberPads.map((text, index) => {
          return (
            <Button 
              key={index}
              borderRadius='2rem'
              fontSize="3xl"
              variant="ghost"
              height='3.5rem'
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