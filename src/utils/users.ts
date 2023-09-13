import { ethers, isAddress, ZeroAddress } from 'ethers';
import { useCallback, useState, useEffect } from 'react';
import { useAppContext } from '../providers/AppProvider';
import { getValue, CacheKeys, setValue, CacheExpiry } from './cache';
import { truncateEthAddress } from './eth';
import { useAppToast } from './ui';
import V5EtherscanProvider, { HistoricalTransaction } from './V5EtherscanProvider';
import { CHAIN_ID } from '../providers/AppProvider';

const NAME_REGISTRY_ADDRESS = CHAIN_ID === 5 ? 
  '0xd78fdaf7aa9d73dbd8b3b96cc842315f6e63e053' : '0x487b88949305bd891337e34ed35060dac42b8535';

const NAME_REGISTRY_ABI = [
  {
    name: 'registerName',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { internalType: 'string', name: '_name', type: 'string' }
    ],
    outputs: []
  },
  {
    name: 'addressToName',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { internalType: 'address', name: '', type: 'address' }
    ],
    outputs: [{
      'internalType': 'string',
      'name': '',
      'type': 'string'
    }]
  },
  {
    name: 'nameToAddress',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { internalType: 'string', name: '', type: 'string' }
    ],
    outputs: [{
      'internalType': 'address',
      'name': '',
      'type': 'address'
    }]
  }
];

/**
 * Gets the provided user's send / receive history.
 * 
 * Also provides fields for the initial loading or error state of
 * the data fetching, as well as a refresh function to do it again.
 */
export function useGetHistory(address: string | undefined) {
  const { wallet } = useAppContext();
  const [history, setHistory] = useState<HistoricalTransaction[]>();
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const toast = useAppToast();
  
  // TODO history should eventually be paginated, but for now it's taking the last
  // two weeks, assuming a 5 second block time for Gnosis Chain
  const twoishWeeks = (86400 * 14) / 5;
  
  // TODO this logic is replicated below because calling refresh()
  // within the useEffect hook adds it as a dependency, and was causing some
  // rerendering hell.  Figure out a way to refactor this properly.
  const refresh = async () => {
    if (!wallet || !address) return;
      
    const provider = new V5EtherscanProvider();
    let transactions: HistoricalTransaction[] = [];
    try {
      const twoishWeeksAgo = await provider.getBlockNumber() - twoishWeeks;
      transactions = await (provider).getHistory(address, twoishWeeksAgo);
    } catch (e) {
      //
    }
    const filtered = transactions.filter((t) => {
      if (t.value && t.value !== '0' && t.txreceipt_status === '1') {
        return true;
      }
      return false;
    });
    setHistory(filtered);
  };
  
  useEffect(() => {
    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval);
  });
  
  useEffect(() => {
    const getHistory = async () => {
      if (!wallet || !address) {
        setInitialLoading(false);
        return;
      }
      const provider = new V5EtherscanProvider();
      let transactions: HistoricalTransaction[] = [];
      try {
        const twoishWeeksAgo = await provider.getBlockNumber() - twoishWeeks;
        transactions = await (provider).getHistory(address, twoishWeeksAgo);
      } catch (e) {
        toast(String(e));
      }
      const filtered = transactions.filter((t) => {
        if (t.value && t.value !== '0' && t.txreceipt_status === '1') {
          return true;
        }
        return false;
      });
      setHistory(filtered);
      setInitialLoading(false);
    };
    getHistory().catch(() => {
      setInitialLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twoishWeeks, wallet, address]);
  
  return { history, initialLoading, refresh };
}
  
export function isValidUsername(name: string | undefined): boolean {
  // cut the @ symbol, if it's there
  const checkedName = name && name.startsWith('@') ? name.substring(1, name.length) : name;
  return !!checkedName && checkedName.length > 5 && checkedName.length < 17 && /^[a-z0-9_]*$/.test(checkedName);
}
  
export function useRegisterUsername() {
  const { wallet, setProgressMessage } = useAppContext();
  const toast = useAppToast();
  
  const registerName = useCallback((name: string) => {
    const register = async () => {
      setProgressMessage('Registering name...');
      const registryContract = new ethers.Contract(NAME_REGISTRY_ADDRESS, NAME_REGISTRY_ABI, wallet);
      const tx = await registryContract.registerName(name);
      await tx.wait();
      setProgressMessage(undefined);
  
      // TODO we need better state management, the user's name
      // should be placed in the app provider, and use a reducer
      // or something so that when it changes this will go away
      // automatically
      window.location.reload();
    };
  
    register().catch(() => {
      toast('Whoops, something went wrong.');
      setProgressMessage(undefined);
    });
  }, [setProgressMessage, toast, wallet]);
  
  return { registerName };
}
  
/**
  * Returns a stateful representation of the user's name, as defined
  * by the LuaNameRegistry contract.
  * 
  * undefined means we haven't yet determined if they have a name
  * null means we checked, and that they don't have one
  */
export function useAddressToUsername(address: string | undefined) {
  const { wallet } = useAppContext();
  const cached: string = getValue(CacheKeys.ADDRESS_TO_USERNAME + address);
  const [username, setUsername] = useState<string | null | undefined>(cached);
  
  useEffect(() => {
    const resolve = async () => {
      if (cached) {
        setUsername('@' + cached);
        return;
      } else if (!address || !wallet) {
        setUsername(undefined);
        return;
      }
  
      const registryContract = new ethers.Contract(NAME_REGISTRY_ADDRESS, NAME_REGISTRY_ABI, wallet);
      const nameFromContract: string = await registryContract.addressToName(address);
      if (nameFromContract.length > 0) {
        setValue(CacheKeys.ADDRESS_TO_USERNAME + address, nameFromContract, CacheExpiry.NEVER);
        setUsername('@' + nameFromContract);
      } else {
        setUsername(null);
      }
    };
    try {
      resolve();
    } catch (e) {
      // do nothing
    }
  }, [address, wallet, cached]);
  
  return { username };
}
  
export function useUsernameToAddress(username: string) {
  const { wallet } = useAppContext();
  const [address, setAddress] = useState<string>();
  
  useEffect(() => {
    const resolve = async () => {
  
      // cut the @ symbol, if it's there
      const checkedName = username && username.startsWith('@') ? username.substring(1, username.length) : username;
    
      const cached: string = getValue(CacheKeys.USERNAME_TO_ADDRESS + checkedName);
      if (cached) {
        setAddress(cached);
        return;
      }
  
      if (isAddress(checkedName)) {
        setAddress(checkedName);
      } else if (!isValidUsername(checkedName)) {
        setAddress(undefined);
      } else {
        const registryContract = new ethers.Contract(NAME_REGISTRY_ADDRESS, NAME_REGISTRY_ABI, wallet);
        const address: string = await registryContract.nameToAddress(checkedName);
        if (address !== ZeroAddress) {
          setValue(CacheKeys.USERNAME_TO_ADDRESS + checkedName, address, CacheExpiry.NEVER);
          setAddress(address);
        } else {
          setAddress(undefined);
        }
      }
    };
    try {
      resolve();
    } catch (e) {
      setAddress(undefined);
    }
  }, [username, wallet]);
  
  return { address };
}
  
export function useDisplayName(address: string) {
  const [displayName, setDisplayName] = useState<string>(truncateEthAddress(address));
  const { username } = useAddressToUsername(address);
  useEffect(() => {
    setDisplayName(username ? username : truncateEthAddress(address));
  }, [address, username]);
  
  return displayName;
}

const USER_VALUES_ADDRESS = CHAIN_ID === 5 ? 
  '0xde4Ecc89d8D5Cb11AaAfa67FC1c3972503aB0021' : '0x1EB4beEc0DB7fc25b84b62c36b0483eb40e65557';

const USER_VALUES_ABI = [
  {
    name: 'updateValue',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { internalType: 'string', name: '_key', type: 'string' },
      { internalType: 'string', name: '_value', type: 'string' }
    ],
    outputs: []
  },
  {
    name: 'values',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'string', name: '', type: 'string' }
    ],
    outputs: [{
      'internalType': 'string',
      'name': '',
      'type': 'string'
    }]
  }
];

export function useSetUserValue(key: string) {
  const { wallet } = useAppContext();
  const setUserValue = useCallback(async (value: string | undefined) => {
    const updateValue = async () => {
      const registryContract = new ethers.Contract(USER_VALUES_ADDRESS, USER_VALUES_ABI, wallet);
      const tx = await registryContract.updateValue(key, value);
      await tx.wait();

      // cache it
      setValue(key + wallet?.address, value, CacheExpiry.ONE_HOUR);

      // TODO broadcast here to update state
    };
    updateValue();
  }, [key, wallet]);
  
  return setUserValue;
}

export function useGetUserValue(address: string, key: string) {
  const { wallet } = useAppContext();
  const cached: string = getValue(key + address);
  const [userValue, setUserValue] = useState<string | null | undefined>(cached);
  
  useEffect(() => {
    const resolve = async () => {
      if (cached) {
        setUserValue(cached);
        return;
      } else if (!address || !wallet) {
        setUserValue(undefined);
        return;
      }
  
      const userValuesContract = new ethers.Contract(USER_VALUES_ADDRESS, USER_VALUES_ABI, wallet);
      const valueFromContract: string = await userValuesContract.values(address, key);
      setUserValue(valueFromContract);
      // cache it
      setValue(key + address, valueFromContract, CacheExpiry.ONE_HOUR);
    };
    try {
      resolve();
    } catch (e) {
      // do nothing
    }
  }, [address, wallet, cached, key]);
  
  return userValue;
}