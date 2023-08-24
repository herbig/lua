import React, { ReactNode, createContext, useContext, useState } from 'react';

interface LuaContext {
    key: string | undefined;
    setKey: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const AppContext = createContext<LuaContext>({
  key: undefined,
  setKey: function (): void {
    //
  }
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [key, setKey] = useState<string | undefined>(undefined);
  const context: LuaContext = { key, setKey };

  // TODO set key to encrypted store
  // https://www.npmjs.com/package/react-secure-storage

  return (
    <AppContext.Provider value={context}>
      {children}
    </AppContext.Provider>
  );
}
 
export const useAppContext = () => useContext(AppContext);