import * as React from 'react';
import {
  Box,
  Divider,
  Flex,
  IconButton,
  Spacer,
  TabPanel,
  TabPanelProps,
  Text
} from '@chakra-ui/react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { APP_DEFAULT_H_PAD } from '../main/AppRouter';
import { displayAmount } from '../../utils/eth';

interface Transaction {
  type: 'send' | 'receive';
  username: string;
  date: Date;
  amount: number;
}

function TransactionRow({ transaction } : { transaction: Transaction }) {
  return (
    <Box>
      <Flex pt="1rem" pb="1rem" ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD} h="5rem" alignItems="center">
        <IconButton aria-label={transaction.type} colorScheme={transaction.type === 'send' ? 'red' : 'green'}>{transaction.type === 'send' ? <FaArrowUp /> : <FaArrowDown />}</IconButton>
        <Flex flexDirection="column" ps="1rem">
          <Text as="b">{transaction.username}</Text>
          <Text>{transaction.date.toDateString()}</Text>
        </Flex>
        <Spacer />
        <Text as="b" fontSize="lg">{displayAmount(transaction.amount)}</Text>
      </Flex>
      <Divider />
    </Box>
  );
}

const stub: Array<Transaction> = [
  {
    type: 'send',
    username: 'herbig',
    date: new Date(),
    amount: 45.44
  },
  {
    type: 'receive',
    username: 'herbig',
    date: new Date(),
    amount: 45.44
  },
  {
    type: 'send',
    username: 'herbig',
    date: new Date(),
    amount: 45.44
  },
  {
    type: 'receive',
    username: 'herbig',
    date: new Date(),
    amount: 45.44
  },
  {
    type: 'receive',
    username: 'herbig',
    date: new Date(),
    amount: 45.44
  },
  {
    type: 'receive',
    username: 'herbig',
    date: new Date(),
    amount: 45.44
  },
  {
    type: 'receive',
    username: 'herbig',
    date: new Date(),
    amount: 45.44
  }
];

export function TabHistory({...props}: TabPanelProps) {
  return (
    <TabPanel p="0" {...props}>
      {stub.map((transaction, index) => {
        return (
          <TransactionRow key={index} transaction={transaction} />
        );
      })}
    </TabPanel>
  );
}