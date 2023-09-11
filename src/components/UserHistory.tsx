import * as React from 'react';
import {
  Box,
  BoxProps,
  Divider,
  Flex,
  IconButton,
  Spacer,
  Text
} from '@chakra-ui/react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { ethers } from 'ethers';
import { APP_DEFAULT_H_PAD } from '../screens/main/AppRouter';
import { HistoricalTransaction } from '../utils/V5EtherscanProvider';
import { useDisplayName, displayAmount, useGetHistory } from '../utils/eth';
import { elapsedDisplay, useGreenText, useRedText } from '../utils/ui';
import { DataLoading } from './DataLoading';
import { EmptyList } from './EmptyList';
import { PullRefresh } from './PullRefresh';
import { useState } from 'react';
import { UserDetailsModal } from './modals/UserDetailsModal';

function TransactionRow({ address, transaction } : { address: string, transaction: HistoricalTransaction }) {
  
  const to = transaction.to; // TODO checksum these instead of toLowerCasing wallet
  const from = transaction.from;
  const type = to === address.toLowerCase() ? 'Received' : 'Sent';
  const displayName = useDisplayName(type === 'Received' ? from : to);
  const date = elapsedDisplay(Number(transaction.timeStamp));
  const amount = displayAmount(ethers.formatEther(transaction.value));
  const greenText = useGreenText();
  const redText = useRedText();
  const textColor = type === 'Sent' ? redText : greenText;

  const [ showUserHistory, setShowUserHistory ] = useState(false);

  const onClick = () => {
    setShowUserHistory(true);
  };

  return (
    <Box>
      <Flex onClick={onClick} pt="1rem" pb="1rem" ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD} h="5rem" alignItems="center">
        <IconButton pointerEvents="none" aria-label={type} colorScheme={type === 'Sent' ? 'red' : 'green'}>{type === 'Sent' ? <FaArrowUp /> : <FaArrowDown />}</IconButton>
        <Flex flexDirection="column" ps="1rem">
          <Text as="b">{displayName}</Text>
          <Text>{date}</Text>
        </Flex>
        <Spacer />
        <Text as="b" color={textColor} fontSize="lg">{type === 'Sent' ? '- ' : '+ '}{amount}</Text>
      </Flex>
      <Divider />
      {showUserHistory ? 
        <UserDetailsModal 
          address={type === 'Received' ? from : to} 
          isOpen={showUserHistory} 
          onClose={() => {
            setShowUserHistory(false);
          }} /> 
        : 
        null
      }
    </Box>
  );
}

interface Props extends BoxProps {
    address: string;
}

export function UserHistory({ address, ...props }: Props) {
  const { history, initialLoading, refresh } = useGetHistory(address);
  const empty = !history || history?.length === 0;

  return (
    <Box {...props}>
      {initialLoading ?
        <DataLoading />
        : empty ? 
          <EmptyList message="No history yet." refresh={refresh} /> : 
          <PullRefresh onRefresh={refresh}>
            <Flex flexDirection="column">{history?.map((transaction, index) => {
              return (
                <TransactionRow address={address} key={index} transaction={transaction} />
              );
            })}</Flex>
          </PullRefresh>}
    </Box>
  );
}
