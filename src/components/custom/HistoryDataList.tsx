import * as React from 'react';
import { Text, Box, Divider, Flex, BoxProps } from '@chakra-ui/react';
import { useUser } from '../../providers/UserProvider';
import { DataList, DataListRowProps } from '../../components/base/DataList';
import { getHistoryAsync } from '../../utils/history';
import { UserAvatar } from '../../components/avatars/UserAvatar';
import { ClickablSpace } from '../../components/base/ClickableSpace';
import { weiDisplayAmount } from '../../utils/eth';
import { useTextGreen, useTextRed, elapsedDisplay } from '../../utils/ui';
import { useDisplayName } from '../../utils/contracts/usernames';
import { APP_DEFAULT_H_PAD } from '../../screens/main/App';
import { UserDetailsModal } from '../../screens/overlays/UserDetailsModal';
import { CONTENT_HEIGHT } from '../../screens/main/AppContent';
import { HistoricalTransaction } from '../../utils/provider/V5EtherscanProvider';
import { useUI } from '../../providers/UIProvider';

interface Props extends BoxProps {
    userAddress: string;
    refreshIntervalSeconds?: number;
}

export function HistoryDataList({userAddress, refreshIntervalSeconds = 0, ...props}: Props) {
  const { wallet } = useUser();
  const getData = getHistoryAsync(wallet!, userAddress);

  return (
    <DataList<HistoricalTransaction> 
      h={CONTENT_HEIGHT} 
      loadData={getData} 
      emptyMessage={'No transaction history.'} 
      rowHeightRem={USER_LIST_ROW_HEIGHT_REM} 
      refreshIntervalSeconds={refreshIntervalSeconds}
      RowElement={({ ...props }: DataListRowProps<HistoricalTransaction>) => (
        <TransactionRow {...props} myAddress={userAddress} />
      )}
      {...props}
    />
  );
}

interface RowProps extends DataListRowProps<HistoricalTransaction> { 
  myAddress: string, 
}

export const USER_LIST_ROW_HEIGHT_REM = 5;

function TransactionRow({ myAddress, data, style } : RowProps) {
  const { provider } = useUser();
  const { setCurrentModal } = useUI();
  const to = data.to; // TODO checksum these instead of toUpperCasing
  const from = data.from;

  const type = to.toUpperCase() === myAddress.toUpperCase() ? 'Received' : 'Sent';
  const userAddress = type === 'Received' ? from : to;
  const displayName = useDisplayName(userAddress);
  const amount = weiDisplayAmount(data.value);
  const greenText = useTextGreen();
  const redText = useTextRed();
  const textColor = type === 'Sent' ? redText : greenText;
  const message = provider.abiDecode(data.input);

  const date = elapsedDisplay(Number(data.timeStamp), message ? 'short' : 'long');

  const onClick = () => {
    setCurrentModal(
      <UserDetailsModal 
        address={userAddress}
        isOpen={true} 
        onClose={() => {
          setCurrentModal(undefined);
        }} />);
  };

  return (
    <Box style={style}>
      <ClickablSpace onClick={onClick} pt="1rem" pb="1rem" ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD} h={USER_LIST_ROW_HEIGHT_REM + 'rem'} alignItems="center">
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
    </Box>
  );
}