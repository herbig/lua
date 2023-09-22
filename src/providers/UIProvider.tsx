import React, { Dispatch, ReactNode, createContext, useContext, useState } from 'react';

interface UIContext {
  progressMessage: string | undefined;
  setProgressMessage: (message: string | undefined) => void;
  currentModal: JSX.Element | undefined;
  setCurrentModal: Dispatch<React.SetStateAction<JSX.Element | undefined>>;
  refreshFlag: boolean;
  triggerRefresh: () => void;
}

const defaultContext: UIContext = {
  progressMessage: undefined,
  setProgressMessage: () => {},
  currentModal: undefined,
  setCurrentModal: () => {},
  refreshFlag: false,
  triggerRefresh: () => {}
};

export function UIProvider({ children }: { children: ReactNode }) {
  const [progressMessage, setProgressMessage] = useState<string>();
  const [currentModal, setCurrentModal] = useState<JSX.Element>();
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);

  const triggerRefresh = () => {
    setRefreshFlag(!refreshFlag);
  };

  return (
    <UIContext.Provider value={{ 
      progressMessage, 
      setProgressMessage,
      currentModal,
      setCurrentModal,
      refreshFlag,
      triggerRefresh
    }}>
      {children}
    </UIContext.Provider>
  );
}

const UIContext = createContext<UIContext>(defaultContext);
export const useUI = () => useContext(UIContext);