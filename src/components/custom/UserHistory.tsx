import * as React from 'react';
import {
  Box,
  BoxProps,
  Divider,
  Flex,
  Spacer,
  Text
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { APP_DEFAULT_H_PAD } from '../../screens/main/AppRouter';
import { HistoricalTransaction } from '../../utils/V5EtherscanProvider';
import { ethDisplayAmount } from '../../utils/eth';
import { elapsedDisplay, useTextGreen, useTextRed } from '../../utils/ui';
import { useDisplayName, useGetHistory } from '../../utils/users';
import { UserAvatar } from '../avatars/UserAvatar';
import { ClickablSpace } from '../base/ClickableSpace';
import { DataLoading } from '../base/DataLoading';
import { EmptyList } from '../base/EmptyList';
import { PullRefresh } from '../base/PullRefresh';
import { UserDetailsModal } from '../../screens/overlays/UserDetailsModal';

function TransactionRow({ myAddress, transaction } : { myAddress: string, transaction: HistoricalTransaction }) {
  
  const to = transaction.to; // TODO checksum these instead of toLowerCasing wallet
  const from = transaction.from;
  const type = to === myAddress.toLowerCase() ? 'Received' : 'Sent';
  const userAddress = type === 'Received' ? from : to;
  const displayName = useDisplayName(userAddress);
  const date = elapsedDisplay(Number(transaction.timeStamp));
  const amount = ethDisplayAmount(ethers.formatEther(transaction.value));
  const greenText = useTextGreen();
  const redText = useTextRed();
  const textColor = type === 'Sent' ? redText : greenText;

  const [ showUserHistory, setShowUserHistory ] = React.useState(false);

  const onClick = () => {
    setShowUserHistory(true);
  };

  return (
    <Box>
      <ClickablSpace onClick={onClick} pt="1rem" pb="1rem" ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD} h="5rem" alignItems="center">
        <UserAvatar
          address={userAddress}
          w="2.5rem"
          h="2.5rem"
        />
        <Flex flexDirection="column" ps="1rem">
          <Text as="b" mb='0.2rem'>{displayName}</Text>
          <Text>{date}</Text>
        </Flex>
        <Spacer />
        <Text as="b" color={textColor} fontSize="lg">{type === 'Sent' ? '- ' : '+ '}{amount}</Text>
      </ClickablSpace>
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
  const { history, initialLoading, refresh, errorMessage } = useGetHistory(address);
  const empty = !history || history?.length === 0;

  return (
    <Box {...props}>
      {initialLoading ?
        <DataLoading />
        : empty ? 
          <EmptyList emptyMessage="No history yet." errorMessage={errorMessage} refresh={refresh} /> : 
          <PullRefresh h={props.h} onRefresh={refresh}>
            <Flex flexDirection="column">{history?.map((transaction, index) => {
              return (
                <TransactionRow myAddress={address} key={index} transaction={transaction} />
              );
            })}</Flex>
          </PullRefresh>}
    </Box>
  );
}
