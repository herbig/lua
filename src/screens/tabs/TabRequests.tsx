import * as React from 'react';
import { Text, Button, Divider, Flex, TabPanel, TabPanelProps } from '@chakra-ui/react';
import { CONTENT_HEIGHT } from '../main/AppContent';
import { DataList, DataListRowProps } from '../../components/base/DataList';
import { Request, getRequestsAsyc, useFulfillRequest } from '../../utils/requests';
import { ethers } from 'ethers';
import { UserAvatar } from '../../components/avatars/UserAvatar';
import { ethDisplayAmount, abiDecode } from '../../utils/eth';
import { useTextRed, elapsedDisplay } from '../../utils/ui';
import { useDisplayName } from '../../utils/users';
import { APP_DEFAULT_H_PAD } from '../main/App';
import { USER_LIST_ROW_HEIGHT_REM } from '../../components/custom/HistoryDataList';
import { useAppContext } from '../../providers/AppProvider';

export function TabRequests({...props}: TabPanelProps) {

  const { wallet } = useAppContext();

  const getData = getRequestsAsyc(wallet!, wallet!.address, 'requests');

  return (
    <TabPanel p="0" {...props}>
      <DataList<Request> 
        h={CONTENT_HEIGHT} 
        loadData={getData} 
        emptyMessage={'No payment requests.'} 
        rowHeightRem={USER_LIST_ROW_HEIGHT_REM} 
        refreshIntervalSeconds={20}
        RowElement={({ ...props }: DataListRowProps<Request>) => (
          <RequestRow {...props} />
        )}
        {...props}
      />
    </TabPanel>
  );
}

function RequestRow({ data, ...props } : DataListRowProps<Request>) {
  const request = data;

  const displayName = useDisplayName(request.to);
  const amount = ethDisplayAmount(ethers.formatEther(request.value));
  const redText = useTextRed();
  const message = abiDecode(request.input);

  const date = elapsedDisplay(Number(request.timeStamp), message ? 'short' : 'long');
  const fulfill = useFulfillRequest();

  return (
    <Flex style={props.style} flexDirection='column'>
      <Flex alignItems="center" ps={APP_DEFAULT_H_PAD} pe={APP_DEFAULT_H_PAD} h="5rem">
        <UserAvatar
          address={request.to}
          w="2.5rem"
          h="2.5rem"
        />
        <Flex flexDirection="column" ps="1rem" flex='1'>
          <Text mb='0.2rem' as='b'>{displayName}</Text>
          <Text ms='0.2rem' noOfLines={1}>{date}{message ? ', ' + message : ''}</Text>
        </Flex>
        <Button onClick={() => {fulfill(request);}} borderRadius='2rem' color={redText} size='sm'>-{amount}</Button>
      </Flex>
      <Divider />
    </Flex>
  );
}
