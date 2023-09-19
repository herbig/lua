import { useCallback } from 'react';
import { CHAIN_ID, useAppContext } from '../providers/AppProvider';
import { addFriendWeight } from './friends';
import { useAppToast } from './ui';
import { Wallet, ZeroAddress, ethers } from 'ethers';
import { HistoricalTransaction } from './V5EtherscanProvider';
import { abiEncode } from './eth';

export const REQUESTS_ADDRESS = CHAIN_ID === 5 ? 
  '0x9B3DB51c73E27C25bd19bE7af3e4D128C8ad9b36' : '0x77AE090463E47AFe9e33182a8C020fAD239Dd788';

const REQUESTS_ABI = [{
  'inputs': [{
    'internalType': 'uint256',
    'name': '_index',
    'type': 'uint256'
  }],
  'name': 'decline',
  'outputs': [],
  'stateMutability': 'nonpayable',
  'type': 'function'
}, {
  'inputs': [{
    'internalType': 'uint256',
    'name': '_index',
    'type': 'uint256'
  }],
  'name': 'fulfill',
  'outputs': [],
  'stateMutability': 'payable',
  'type': 'function'
}, {
  'inputs': [{
    'internalType': 'address',
    'name': '_who',
    'type': 'address'
  }],
  'name': 'getFulfillments',
  'outputs': [{
    'components': [{
      'internalType': 'address',
      'name': 'from',
      'type': 'address'
    }, {
      'internalType': 'address',
      'name': 'to',
      'type': 'address'
    }, {
      'internalType': 'bytes',
      'name': 'input',
      'type': 'bytes'
    }, {
      'internalType': 'uint256',
      'name': 'value',
      'type': 'uint256'
    }, {
      'internalType': 'uint256',
      'name': 'timeStamp',
      'type': 'uint256'
    }],
    'internalType': 'struct LuaRequestPayment.Request[]',
    'name': '',
    'type': 'tuple[]'
  }],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [{
    'internalType': 'address',
    'name': '_who',
    'type': 'address'
  }],
  'name': 'getRequests',
  'outputs': [{
    'components': [{
      'internalType': 'address',
      'name': 'from',
      'type': 'address'
    }, {
      'internalType': 'address',
      'name': 'to',
      'type': 'address'
    }, {
      'internalType': 'bytes',
      'name': 'input',
      'type': 'bytes'
    }, {
      'internalType': 'uint256',
      'name': 'value',
      'type': 'uint256'
    }, {
      'internalType': 'uint256',
      'name': 'timeStamp',
      'type': 'uint256'
    }],
    'internalType': 'struct LuaRequestPayment.Request[]',
    'name': '',
    'type': 'tuple[]'
  }],
  'stateMutability': 'view',
  'type': 'function'
}, {
  'inputs': [{
    'internalType': 'address',
    'name': '_from',
    'type': 'address'
  }, {
    'internalType': 'uint256',
    'name': '_amount',
    'type': 'uint256'
  }, {
    'internalType': 'bytes',
    'name': '_message',
    'type': 'bytes'
  }],
  'name': 'request',
  'outputs': [],
  'stateMutability': 'nonpayable',
  'type': 'function'
}];

export interface Request extends HistoricalTransaction {
    index: number
}

export const getRequestsAsyc = (wallet: Wallet, userAddress: string, type: 'requests' | 'fulfillments') => {
  return async () => {
    return await getRequestsArray(wallet, userAddress, type);
  };
};

export const getRequestsArray = async (wallet: Wallet, userAddress: string, type: 'requests' | 'fulfillments') => {
  
  const requestsContract = new ethers.Contract(REQUESTS_ADDRESS, REQUESTS_ABI, wallet);
  
  const requestsResult: any[] = 
    await (type === 'requests' ? requestsContract.getRequests(userAddress) : 
      requestsContract.getFulfillments(userAddress));

  const formatted: Request[] = [];
  for (let i = 0; i < requestsResult.length; i++) {
    const tuple: string[] = requestsResult[i].toString().split(',');
    
    // TODO for some reason deleted array members still show in the ABI
    // get function.. investigate why that is, for now we just skit it
    if (tuple[0] === ZeroAddress) continue;

    formatted.push(
      {
        index: i,
        from: tuple[0],
        to: tuple[1],
        input: tuple[2],
        value: tuple[3],
        timeStamp: tuple[4],
        txreceipt_status: '1'
      }
    );
  }
  formatted.sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp));

  return formatted;
};

export function useRequestEth() {
  const { wallet, setProgressMessage } = useAppContext();
  const toast = useAppToast();
  
  const requestEth = useCallback((fromAddress: string, message: string | undefined, ethAmount: number) => {
    const request = async () => {
      if (!wallet) return;
  
      setProgressMessage('Requesting Cash...');
  
      const requestsContract = new ethers.Contract(REQUESTS_ADDRESS, REQUESTS_ABI, wallet);

      await requestsContract.request(
        fromAddress, 
        ethers.parseEther(ethAmount.toString()),
        abiEncode(message ? message : '')
      );
  
      toast('Success!');
  
      addFriendWeight(fromAddress);
        
      setProgressMessage(undefined);
    };
  
    request().catch(() => {
      toast('Whoops, something went wrong.');
      setProgressMessage(undefined);
    });
  }, [setProgressMessage, toast, wallet]);
  
  return requestEth;
}

export function useFulfillRequest() {
  const { wallet, setProgressMessage } = useAppContext();
  const toast = useAppToast();
  
  const fulfill = useCallback((request: Request) => {
    const fulfillRequest = async () => {
      if (!wallet) return;
  
      setProgressMessage('Sending Cash...');
  
      const requestsContract = new ethers.Contract(REQUESTS_ADDRESS, REQUESTS_ABI, wallet);
      await requestsContract.fulfill(request.index, {value: request.value});
  
      toast('Success!');
  
      addFriendWeight(request.to);
        
      setProgressMessage(undefined);
    };
  
    fulfillRequest().catch(() => {
      toast('Whoops, something went wrong.');
      setProgressMessage(undefined);
    });
  }, [setProgressMessage, toast, wallet]);
  
  return fulfill;
}

export function useDeclineRequest() {
  const { wallet, setProgressMessage } = useAppContext();
  const toast = useAppToast();
  
  const decline = useCallback((request: Request) => {
    const fulfillRequest = async () => {
      if (!wallet) return;
  
      setProgressMessage('Declining Request...');
  
      const requestsContract = new ethers.Contract(REQUESTS_ADDRESS, REQUESTS_ABI, wallet);
      await requestsContract.decline(request.index);
  
      toast('Declined!');
  
      setProgressMessage(undefined);
    };
  
    fulfillRequest().catch(() => {
      toast('Whoops, something went wrong.');
      setProgressMessage(undefined);
    });
  }, [setProgressMessage, toast, wallet]);
  
  return decline;
}