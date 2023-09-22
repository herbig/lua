import { ethers } from 'ethers';
import React, { ReactNode, createContext, useContext, useState } from 'react';
import { useGetEthBalance } from '../utils/eth';
import { LuaProvider } from '../utils/provider/LuaProvider';
import { clearCache, getPrivateKey, setPrivateKey } from '../utils/cache';
import { clearFriendsLocalCache } from '../utils/friends';

export function UserProvider({ children }: { children: ReactNode }) {
  const storedKey = getPrivateKey();
  const storedWallet = storedKey ? new ethers.Wallet(storedKey, provider) : undefined;
  const [wallet, setWallet] = useState<ethers.Wallet | undefined>(storedWallet);
  const ethBalance = useGetEthBalance(wallet?.address, 5); // 5 second refresh timer

  const logIn = (privateKey: string) => {
    setPrivateKey(privateKey);
    setWallet(new ethers.Wallet(privateKey, provider));
  };

  const logOut = () => {
    setWallet(undefined);
    clearCache();
    clearFriendsLocalCache();
  };

  return (
    <UserContext.Provider value={{ 
      provider, 
      wallet, 
      ethBalance, 
      logIn,
      logOut
    }}>
      {children}
    </UserContext.Provider>
  );
}

interface UserContext {
  provider: LuaProvider;
  wallet: ethers.Wallet | undefined;
  ethBalance: string;
  logIn: (key: string) => void;
  logOut: () => void;
}

const provider = new LuaProvider();

const UserContext = createContext<UserContext>({
  provider: provider,
  wallet: undefined,
  ethBalance: '0',
  logIn: () => {},
  logOut: () => {}
});

export const useUser = () => useContext(UserContext);