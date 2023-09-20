import { ethers } from 'ethers';
import React, { Dispatch, ReactNode, createContext, useContext, useState } from 'react';
import { useGetEthBalance } from '../utils/eth';
import SecureLS from 'secure-ls';
import { LuaProvider } from '../utils/provider/LuaProvider';

interface LuaContext {
  wallet: ethers.Wallet | undefined;
  provider: LuaProvider;
  ethBalance: string;
  setUser: (key: string | undefined) => void;
  progressMessage: string | undefined;
  setProgressMessage: (message: string | undefined) => void;
  currentModal: JSX.Element | undefined;
  setCurrentModal: Dispatch<React.SetStateAction<JSX.Element | undefined>>;
  refreshFlag: boolean;
  triggerRefresh: () => void;
}

const defaultContext: LuaContext = {
  wallet: undefined,
  provider: new LuaProvider(),
  ethBalance: '0',
  setUser: () => {},
  progressMessage: undefined,
  setProgressMessage: () => {},
  currentModal: undefined,
  setCurrentModal: () => {},
  refreshFlag: false,
  triggerRefresh: () => {}
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
  const [currentModal, setCurrentModal] = useState<JSX.Element>();
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);

  const triggerRefresh = () => {
    setRefreshFlag(!refreshFlag);
  };

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
      setProgressMessage,
      currentModal,
      setCurrentModal,
      refreshFlag,
      triggerRefresh
    }}>
      {children}
    </AppContext.Provider>
  );
}

const AppContext = createContext<LuaContext>(defaultContext);
export const useAppContext = () => useContext(AppContext);