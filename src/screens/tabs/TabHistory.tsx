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
import { displayAmount, truncateEthAddress, useGetHistory } from '../../utils/eth';
import { useAppContext } from '../../AppProvider';
import { ethers } from 'ethers';
import { DataLoading } from '../../components/DataLoading';
import { PullRefresh } from '../../components/PullRefresh';
import { EmptyList } from '../../components/EmptyList';
import { HistoricalTransaction } from '../../utils/V5EtherscanProvider';
import { elapsedDisplay } from '../../utils/theme';

function TransactionRow({ transaction } : { transaction: HistoricalTransaction }) {
  const { wallet } = useAppContext();
  
  const to = transaction.to; // TODO checksum these instead of toLowerCasing wallet
  const from = transaction.from;
  const type = to === wallet?.address.toLowerCase() ? 'Received' : 'Sent';
  const address = truncateEthAddress(type === 'Received' ? from : to);
  const date = elapsedDisplay(Number(transaction.timeStamp));
  const amount = displayAmount(ethers.formatEther(transaction.value));

  return (
    <Box>
      <Flex pt="1rem" pb="1rem" ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD} h="5rem" alignItems="center">
        <IconButton pointerEvents="none" aria-label={type} colorScheme={type === 'Sent' ? 'red' : 'green'}>{type === 'Sent' ? <FaArrowUp /> : <FaArrowDown />}</IconButton>
        <Flex flexDirection="column" ps="1rem">
          <Text as="b">{address}</Text>
          <Text>{date}</Text>
        </Flex>
        <Spacer />
        <Text as="b" fontSize="lg">{amount}</Text>
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
            <EmptyList message="No history yet." refresh={refresh} />
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
