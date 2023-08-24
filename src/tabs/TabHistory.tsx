import * as React from 'react'
import {
  Box,
  Divider,
  Flex,
  IconButton,
  Spacer,
  TabPanel,
  TabPanelProps,
  Text,
} from '@chakra-ui/react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

interface Transaction {
  type: 'send' | 'receive';
  username: string;
  date: Date;
  amount: number;
}

function TransactionRow({ transaction } : { transaction: Transaction }) {
  return (
    <Box>
      <Flex p="1rem" h="5rem" alignItems="center">
        <IconButton aria-label={transaction.type} colorScheme={transaction.type === 'send' ? 'red' : 'green'}>{transaction.type === 'send' ? <FaArrowUp /> : <FaArrowDown />}</IconButton>
        <Flex flexDirection="column" ps="1rem">
          <Text as="b">{transaction.username}</Text>
          <Text>{transaction.date.toDateString()}</Text>
        </Flex>
        <Spacer />
        <Text as="b" fontSize="lg">${transaction.amount}</Text>
      </Flex>
      <Divider />
    </Box>
  )
}

const stub: Array<Transaction> = [
  {
    type: 'send',
    username: 'herbig',
    date: new Date(),
    amount: 45.44,
  },
  {
    type: 'receive',
    username: 'herbig',
    date: new Date(),
    amount: 45.44,
  },
  {
    type: 'send',
    username: 'herbig',
    date: new Date(),
    amount: 45.44,
  },
  {
    type: 'receive',
    username: 'herbig',
    date: new Date(),
    amount: 45.44,
  },
  {
    type: 'receive',
    username: 'herbig',
    date: new Date(),
    amount: 45.44,
  },
  {
    type: 'receive',
    username: 'herbig',
    date: new Date(),
    amount: 45.44,
  },
  {
    type: 'receive',
    username: 'herbig',
    date: new Date(),
    amount: 45.44,
  },
];

export function TabHistory({ ...props }: TabPanelProps) {
  return (
    <TabPanel {...props} p="0">
      {stub.map((transaction, index) => {
        return (
          <TransactionRow key={index} transaction={transaction} />
        );
      })}
    </TabPanel>
  )
}