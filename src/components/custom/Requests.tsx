import * as React from 'react';
import {
  Box,
  BoxProps,
  Button,
  Divider,
  Flex,
  Text
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { APP_DEFAULT_H_PAD } from '../../screens/main/App';
import { abiDecode, ethDisplayAmount } from '../../utils/eth';
import { elapsedDisplay, useTextRed } from '../../utils/ui';
import { useDisplayName } from '../../utils/users';
import { UserAvatar } from '../avatars/UserAvatar';
import { DataLoading } from '../base/DataLoading';
import { EmptyList } from '../base/EmptyList';
import { PullRefresh } from '../base/PullRefresh';
import { useFulfillRequest, useGetRequests } from '../../utils/requests';
import { Request } from '../../utils/requests';

export function Requests({ ...props }: BoxProps) {
  const { requests, isLoading, refresh, errorMessage } = useGetRequests();
  const empty = !requests || requests?.length === 0;

  return (
    <Box {...props}>
      {empty && isLoading ?
        <DataLoading />
        : empty ? 
          <EmptyList emptyMessage="No requests." errorMessage={errorMessage} refresh={refresh} /> : 
          <PullRefresh h={props.h} onRefresh={refresh}>
            <Flex flexDirection="column">
              {requests?.map((r, index) => {
                return (
                  <RequestRow key={index} request={r} />
                );
              })}
            </Flex>
          </PullRefresh>
      }
    </Box>
  );
}

function RequestRow({ request } : { request: Request }) {
  const displayName = useDisplayName(request.to);
  const amount = ethDisplayAmount(ethers.formatEther(request.value));
  const redText = useTextRed();
  const message = abiDecode(request.input);

  const date = elapsedDisplay(Number(request.timeStamp), message ? 'short' : 'long');
  const fulfill = useFulfillRequest();

  return (
    <Flex flexDirection='column'>
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