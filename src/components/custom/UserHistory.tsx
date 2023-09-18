import * as React from 'react';
import {
  Box,
  BoxProps,
  Divider,
  Flex,
  Text
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { APP_DEFAULT_H_PAD } from '../../screens/main/App';
import { HistoricalTransaction } from '../../utils/V5EtherscanProvider';
import { abiDecode, ethDisplayAmount } from '../../utils/eth';
import { elapsedDisplay, remToPx, useTextGreen, useTextRed } from '../../utils/ui';
import { useDisplayName } from '../../utils/users';
import { UserAvatar } from '../avatars/UserAvatar';
import { ClickablSpace } from '../base/ClickableSpace';
import { DataLoading } from '../base/DataLoading';
import { EmptyList } from '../base/EmptyList';
import { PullRefresh } from '../base/PullRefresh';
import { UserDetailsModal } from '../../screens/overlays/UserDetailsModal';
import { useGetHistory } from '../../utils/history';
import { CSSProperties } from 'react';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface Props extends BoxProps {
    address: string;
}

export function UserHistory({ address, ...rest }: Props) {
  const { history, isLoading, refresh, errorMessage } = useGetHistory(address);
  const empty = !history || history?.length === 0;

  const rowHeight = remToPx(ROW_HEIGHT_REM); 

  // react-window wrapper to do its rendering magic
  const Row = ({ index, style }: { index: number, style: CSSProperties }) => (
    <TransactionRow myAddress={address} transaction={history[index]} style={style} />
  );
   
  return (
    <Box {...rest}>
      {empty && isLoading ?
        <DataLoading />
        : empty ? 
          <EmptyList emptyMessage="No history yet." errorMessage={errorMessage} refresh={refresh} /> : 
          <PullRefresh h={rest.h} onRefresh={refresh}>
            <AutoSizer>
              {({ height, width }: { height: number, width: number }) => (
                <FixedSizeList
                  width={width}
                  height={height}
                  itemCount={history.length}
                  itemSize={rowHeight}
                >
                  {Row}
                </FixedSizeList>
              )}
            </AutoSizer>
          </PullRefresh>
      }
    </Box>
  );
}

interface RowProps { 
  myAddress: string, 
  transaction: HistoricalTransaction,
  // required by react-window to render properly
  style: CSSProperties
 }

const ROW_HEIGHT_REM = 5;

function TransactionRow({ myAddress, transaction, style } : RowProps) {
  
  const to = transaction.to; // TODO checksum these instead of toUpperCasing
  const from = transaction.from;

  const type = to.toUpperCase() === myAddress.toUpperCase() ? 'Received' : 'Sent';
  const userAddress = type === 'Received' ? from : to;
  const displayName = useDisplayName(userAddress);
  const amount = ethDisplayAmount(ethers.formatEther(transaction.value));
  const greenText = useTextGreen();
  const redText = useTextRed();
  const textColor = type === 'Sent' ? redText : greenText;
  const message = abiDecode(transaction.input);

  const date = elapsedDisplay(Number(transaction.timeStamp), message ? 'short' : 'long');

  const [ showUserHistory, setShowUserHistory ] = React.useState(false);

  const onClick = () => {
    setShowUserHistory(true);
  };

  return (
    <Box style={style}>
      <ClickablSpace onClick={onClick} pt="1rem" pb="1rem" ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD} h={ROW_HEIGHT_REM + 'rem'} alignItems="center">
        <UserAvatar
          address={userAddress}
          w="2.5rem"
          h="2.5rem"
        />
        <Flex flexDirection="column" ps="1rem" flex='1'>
          <Text mb='0.2rem' as='b'>{displayName}</Text>
          <Text ms='0.2rem' noOfLines={1}>{date}{message ? ', ' + message : ''}</Text>
        </Flex>
        <Text ms='0.2rem' as="b" color={textColor} fontSize="lg">{type === 'Sent' ? '- ' : '+ '}{amount}</Text>
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