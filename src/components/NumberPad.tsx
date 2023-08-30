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

/**
 * The maximum amount the app will allow to be sent in a single 
 * transaction.
 * 
 * This was set initially to 9999, as 9998.99 was tested as the
 * longest string that doesn't break the UI, however it may also
 * be a good idea to restrict sending $10k, to avoid triggering
 * IRS reporting laws, but we're not a bank and I'm not a lawyer.
 * 
 * CashApp only allows up to 9999, probably for that reason.
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

  /** Called whenever the amount changes. */
  onNumberChanged: (amount: number) => void;
}

/**
 * A NumberPad component, similar to Venmo or CashApp's method of inputting an
 * amount of USD to send to a given recipient.
 * 
 * Only a maximum amount and onNumberChanged callback are necessary, and
 * the utilizing component will get back the current number whenever the user
 * taps on the number pad.
 */
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
  const onClickPad = (character: string) => {
    switch(character) {
    case '<':
      if (amount.length > 1) {
        changeAmount(amount.substring(0, amount.length - 1));
      } else {
        changeAmount('0');
      }
      break;
    case '.':
      if (!amount.includes('.')) {
        changeAmount(amount + character);
      }
      break;
    default:
      if (character === '0' && amount.startsWith('0.0')) {
        // do nothing
      } else if (amount === '0') {
        changeAmount(character);
      } else if (amount.includes('.') && amount.length - amount.indexOf('.') > 2) {
        changeAmount(amount.substring(0, amount.length - 1) + character);
      } else {
        changeAmount(amount + character);
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