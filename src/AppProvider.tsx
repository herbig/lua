import React, { ReactNode, createContext, useContext, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';

interface LuaContext {
    key: string | undefined;
    setUser: (key: string | undefined) => void;
}

const AppContext = createContext<LuaContext>({
  key: undefined,
  setUser: function (): void {
    //
  }
});

const STORE_KEY = 'key';

export function AppProvider({ children }: { children: ReactNode }) {
  const [key, setKey] = useState<string | undefined>(secureLocalStorage.getItem(STORE_KEY)?.toString());

  // const wallet = new ethers.Wallet(key, ethers.getDefaultProvider(CHAIN));

  const setUser = (key: string | undefined) => {
    setKey(key);
    if (key) {
      secureLocalStorage.setItem(STORE_KEY, key);
    } else {
      secureLocalStorage.removeItem(STORE_KEY);
    }
  };

  const context: LuaContext = { key, setUser };

  return (
    <AppContext.Provider value={context}>
      {children}
    </AppContext.Provider>
  );
}
 
export const useAppContext = () => useContext(AppContext);