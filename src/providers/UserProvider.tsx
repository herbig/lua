import { ethers } from 'ethers';
import React, { ReactNode, createContext, useContext, useState } from 'react';
import { useGetEthBalance } from '../utils/eth';
import SecureLS from 'secure-ls';
import { LuaProvider } from '../utils/provider/LuaProvider';

interface UserContext {
  wallet: ethers.Wallet | undefined;
  provider: LuaProvider;
  ethBalance: string;
  setUser: (key: string | undefined) => void;
}

const defaultContext: UserContext = {
  wallet: undefined,
  provider: new LuaProvider(),
  ethBalance: '0',
  setUser: () => {}
};

const PRIVATE_KEY = 'key';

export function UserProvider({ children }: { children: ReactNode }) {
  const provider = defaultContext.provider;
  const secureLocalStorage = new SecureLS({encodingType: 'rc4', isCompression: false});
  const storedKey = secureLocalStorage.get(PRIVATE_KEY);
  const storedWallet = storedKey ? new ethers.Wallet(storedKey, provider) : undefined;
  const [wallet, setWallet] = useState<ethers.Wallet | undefined>(storedWallet);
  const ethBalance = useGetEthBalance(wallet?.address);

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
    <UserContext.Provider value={{ 
      wallet, 
      provider, 
      ethBalance, 
      setUser 
    }}>
      {children}
    </UserContext.Provider>
  );
}

const UserContext = createContext<UserContext>(defaultContext);
export const useUser = () => useContext(UserContext);