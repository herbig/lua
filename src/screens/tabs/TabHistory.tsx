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
import { DataLoading } from '../../components/DataLoading';
import { PullRefresh } from '../../components/PullRefresh';

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
  const { history, initialLoading, refresh } = useGetHistory();

  return (
    <TabPanel p="0" alignContent="center" {...props}>
      {initialLoading ?
        <DataLoading />
        : 
        <PullRefresh onRefresh={refresh}>
          {!history || history?.length === 0 ? 
            <>TODO Empty screen</> 
            : 
            <Flex flexDirection="column">{history?.map((transaction, index) => {
              return (
                <TransactionRow key={index} transaction={transaction} />
              );
            })}</Flex>}
        </PullRefresh>}
    </TabPanel>
  );
}