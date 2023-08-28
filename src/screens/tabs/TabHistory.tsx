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
import { HistoricalTransaction, displayAmount, truncateEthAddress, useGetHistory } from '../../utils/eth';
import { useAppContext } from '../../AppProvider';
import { ethers } from 'ethers';

function TransactionRow({ transaction } : { transaction: HistoricalTransaction }) {
  const { wallet } = useAppContext();
  
  // TODO move all this conversion stuff to the hook
  // TODO use checksummed address, not to upper
  const type = transaction.to.toUpperCase() === wallet?.address.toUpperCase() ? 'receive' : 'send';
  const ethAmount = ethers.formatEther(transaction.value);
  const address = truncateEthAddress(transaction.to);
  const date = new Date(Number(transaction.timeStamp) * 1000);
  
  return (
    <Box>
      <Flex pt="1rem" pb="1rem" ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD} h="5rem" alignItems="center">
        <IconButton aria-label={type} colorScheme={type === 'send' ? 'red' : 'green'}>{type === 'send' ? <FaArrowUp /> : <FaArrowDown />}</IconButton>
        <Flex flexDirection="column" ps="1rem">
          <Text as="b">{address}</Text>
          <Text>{date.toDateString()}</Text>
        </Flex>
        <Spacer />
        <Text as="b" fontSize="lg">{displayAmount(ethAmount)}</Text>
      </Flex>
      <Divider />
    </Box>
  );
}

export function TabHistory({...props}: TabPanelProps) {
  const { history } = useGetHistory();

  // TODO empty screen
  // TODO pull to refresh https://www.npmjs.com/package/react-simple-pull-to-refresh
  
  return (
    <TabPanel p="0" {...props}>
      {history?.map((transaction, index) => {
        return (
          <TransactionRow key={index} transaction={transaction} />
        );
      })}
    </TabPanel>
  );
}