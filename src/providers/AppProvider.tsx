import { ethers } from 'ethers';
import React, { ReactNode, createContext, useContext, useState } from 'react';
import { useGetEthBalance } from '../utils/eth';
import SecureLS from 'secure-ls';

const FORCE_GNOSIS = true;

export const CHAIN_ID = !FORCE_GNOSIS && process.env.NODE_ENV === 'development' ? 
  5 : 100;

const RPC = CHAIN_ID === 5 ? 
  'https://rpc.ankr.com/eth_goerli' : 'https://rpc.gnosis.gateway.fm';
  
interface LuaContext {
  wallet: ethers.Wallet | undefined;
  provider: ethers.AbstractProvider;
  ethBalance: string;
  setUser: (key: string | undefined) => void;
  progressMessage: string | undefined;
  setProgressMessage: (message: string | undefined) => void;
}

const defaultContext: LuaContext = {
  wallet: undefined,
  provider: ethers.getDefaultProvider(RPC),
  ethBalance: '0',
  setUser: () => {},
  progressMessage: undefined,
  setProgressMessage: () => {}
};

const PRIVATE_KEY = 'key';

export function AppProvider({ children }: { children: ReactNode }) {
  const provider = defaultContext.provider;
  const secureLocalStorage = new SecureLS({encodingType: 'rc4', isCompression: false});
  const storedKey = secureLocalStorage.get(PRIVATE_KEY);
  const storedWallet = storedKey ? new ethers.Wallet(storedKey, provider) : undefined;
  const [wallet, setWallet] = useState<ethers.Wallet | undefined>(storedWallet);
  const ethBalance = useGetEthBalance(wallet?.address);
  const [progressMessage, setProgressMessage] = useState<string>();

  const setUser = (privateKey: string | undefined) => {
    if (privateKey) {
      secureLocalStorage.set(PRIVATE_KEY, privateKey);
      setWallet(new ethers.Wallet(privateKey, provider));
    } else {
      secureLocalStorage.remove(PRIVATE_KEY);
      setWallet(undefined);
    }
  };

  return (
    <AppContext.Provider value={{ 
      wallet, 
      provider, 
      ethBalance, 
      setUser, 
      progressMessage, 
      setProgressMessage 
    }}>
      {children}
    </AppContext.Provider>
  );
}

const AppContext = createContext<LuaContext>(defaultContext);
export const useAppContext = () => useContext(AppContext);