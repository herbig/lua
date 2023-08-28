import { ethers } from 'ethers';
import React, { ReactNode, createContext, useContext, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { useGetEthBalance } from './utils/eth';
import { PROVIDER } from './constants';

interface LuaContext {
    wallet: ethers.Wallet | undefined;
    ethBalance: string | undefined;
    setUser: (key: string | undefined) => void;
    progressMessage: string | undefined;
    setProgressMessage: (message: string | undefined) => void;
}

const AppContext = createContext<LuaContext>({
  wallet: undefined,
  ethBalance: undefined,
  setUser: function (): void {
    //
  },
  progressMessage: undefined,
  setProgressMessage: function (): void {
    //
  }
});

const STORE_KEY = 'key';

export function AppProvider({ children }: { children: ReactNode }) {
  const defaultProvider = ethers.getDefaultProvider(PROVIDER);
  const storedKey = secureLocalStorage.getItem(STORE_KEY)?.toString();
  const storedWallet = storedKey ? new ethers.Wallet(storedKey, defaultProvider) : undefined;
  const [wallet, setWallet] = useState<ethers.Wallet | undefined>(storedWallet);
  const { ethBalance } = useGetEthBalance(wallet?.address);
  const [progressMessage, setProgressMessage] = useState<string>();

  const setUser = (privateKey: string | undefined) => {
    if (privateKey) {
      secureLocalStorage.setItem(STORE_KEY, privateKey);
      setWallet(new ethers.Wallet(privateKey, defaultProvider));
    } else {
      secureLocalStorage.removeItem(STORE_KEY);
      setWallet(undefined);
    }
  };

  const context: LuaContext = { wallet, ethBalance, setUser, progressMessage, setProgressMessage };

  return (
    <AppContext.Provider value={context}>
      {children}
    </AppContext.Provider>
  );
}
 
export const useAppContext = () => useContext(AppContext);