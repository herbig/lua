import * as React from 'react';
import { Text, Button, Divider, Flex, TabPanel, TabPanelProps } from '@chakra-ui/react';
import { CONTENT_HEIGHT } from '../main/AppContent';
import { DataList, DataListRowProps } from '../../components/base/DataList';
import { Request, getRequestsAsyc, useDeclineRequest, useFulfillRequest } from '../../utils/contracts/requests';
import { UserAvatar } from '../../components/avatars/UserAvatar';
import { useTextRed, elapsedDisplay } from '../../utils/ui';
import { useDisplayName } from '../../utils/contracts/usernames';
import { APP_DEFAULT_H_PAD } from '../main/App';
import { USER_LIST_ROW_HEIGHT_REM } from '../../components/custom/HistoryDataList';
import { useAppContext } from '../../providers/AppProvider';
import { FaTrash } from 'react-icons/fa';
import { ConfirmModal } from '../../components/modals/base/ConfirmModal';
import { useEffect, useState } from 'react';
import { weiDisplayAmount } from '../../utils/eth';
import { useUI } from '../../providers/UIProvider';

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
  const { provider } = useAppContext();
  const request = data;

  const displayName = useDisplayName(request.to);
  const amount = weiDisplayAmount(request.value);
  const redText = useTextRed();
  const message = provider.abiDecode(request.input);

  const date = elapsedDisplay(Number(request.timeStamp), message ? 'short' : 'long');
  const fulfill = useFulfillRequest();
  const decline = useDeclineRequest();

  const { setCurrentModal } = useUI();
  const [ confirmShown, setConfirmShown ] = useState<'fulfill' | 'decline'>();
  const confirmText = confirmShown === 'fulfill' ?
    `Click to confirm sending ${amount} to ${displayName}.` : 
    `Decline this requested payment to ${displayName}.`;

  useEffect(() => {
    if (confirmShown) {
      const confirmModal = 
      <ConfirmModal 
        shown={!!confirmShown}
        title='Are you sure?'
        modalBody={<Text>{confirmText}</Text>} 
        confirmText={confirmShown === 'fulfill' ? 'Send ' + amount : 'Decline'} 
        onCancelClick={() => {
          setConfirmShown(undefined);
          setCurrentModal(undefined);
        }} 
        onConfirmClick={() => {
          if (confirmShown === 'fulfill') {
            fulfill(request);
          } else {
            decline(request);
          }
          setConfirmShown(undefined);
          setCurrentModal(undefined);
        }} 
      />;
      setCurrentModal(confirmModal);
    }
  }, [amount, confirmShown, confirmText, decline, fulfill, request, setCurrentModal]);

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
        <Button onClick={() => {setConfirmShown('fulfill');}} borderRadius='2rem' color={redText} size='sm'>-{amount}</Button>
        <Button onClick={() => {setConfirmShown('decline');}} borderRadius='2rem' size='sm' ms='0.3rem'><FaTrash /></Button>
      </Flex>
      <Divider />
    </Flex>
  );
}
