import * as React from 'react';
import { Text, Box, Divider, Flex, BoxProps } from '@chakra-ui/react';
import { useAppContext } from '../../providers/AppProvider';
import { DataList, DataListRowProps } from '../../components/base/DataList';
import { getHistoryAsync } from '../../utils/history';
import { ethers } from 'ethers';
import { UserAvatar } from '../../components/avatars/UserAvatar';
import { ClickablSpace } from '../../components/base/ClickableSpace';
import { HistoricalTransaction } from '../../utils/V5EtherscanProvider';
import { ethDisplayAmount, abiDecode } from '../../utils/eth';
import { useTextGreen, useTextRed, elapsedDisplay } from '../../utils/ui';
import { useDisplayName } from '../../utils/users';
import { APP_DEFAULT_H_PAD } from '../../screens/main/App';
import { UserDetailsModal } from '../../screens/overlays/UserDetailsModal';
import { CONTENT_HEIGHT } from '../../screens/main/AppContent';
import { useState } from 'react';

interface Props extends BoxProps {
    userAddress: string;
    refreshIntervalSeconds?: number;
}

export function HistoryDataList({userAddress, refreshIntervalSeconds = 0, ...props}: Props) {
  const { wallet } = useAppContext();
  const getData = getHistoryAsync(wallet!, wallet!.address);

  const Row = ({ ...props }: DataListRowProps<HistoricalTransaction>) => (
    <TransactionRow {...props} myAddress={userAddress} />
  );

  return (
    <DataList<HistoricalTransaction> 
      h={CONTENT_HEIGHT} 
      loadData={getData} 
      emptyMessage={'No transaction history.'} 
      rowHeightRem={LIST_ROW_HEIGHT_REM} 
      refreshIntervalSeconds={refreshIntervalSeconds}
      RowElement={Row}
      {...props}
    />
  );
}

interface RowProps extends DataListRowProps<HistoricalTransaction> { 
  myAddress: string, 
}

export const LIST_ROW_HEIGHT_REM = 5;

function TransactionRow({ myAddress, data, style } : RowProps) {
  
  const to = data.to; // TODO checksum these instead of toUpperCasing
  const from = data.from;

  const type = to.toUpperCase() === myAddress.toUpperCase() ? 'Received' : 'Sent';
  const userAddress = type === 'Received' ? from : to;
  const displayName = useDisplayName(userAddress);
  const amount = ethDisplayAmount(ethers.formatEther(data.value));
  const greenText = useTextGreen();
  const redText = useTextRed();
  const textColor = type === 'Sent' ? redText : greenText;
  const message = abiDecode(data.input);

  const date = elapsedDisplay(Number(data.timeStamp), message ? 'short' : 'long');

  const [ showUserHistory, setShowUserHistory ] = useState(false);

  const onClick = () => {
    setShowUserHistory(true);
  };

  return (
    <Box style={style}>
      <ClickablSpace onClick={onClick} pt="1rem" pb="1rem" ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD} h={LIST_ROW_HEIGHT_REM + 'rem'} alignItems="center">
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