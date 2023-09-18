import { useState, useEffect } from 'react';
import { useAppContext } from '../providers/AppProvider';
import V5EtherscanProvider, { HistoricalTransaction } from './V5EtherscanProvider';
import { REQUESTS_ADDRESS, getRequestsArray } from './requests';
import { Wallet } from 'ethers';

const ETHERSCAN_PROVIDER = new V5EtherscanProvider();

// TODO history should eventually be paginated, but for now it's taking the last
// two weeks, assuming a 5 second block time for Gnosis Chain
const TWOISHWEEKS = (86400 * 14) / 5;

/**
 * Gets the provided user's send / receive history.
 * 
 * Also provides fields for the initial loading or error state of
 * the data fetching, as well as a refresh function to do it again.
 * 
 * @param address the address of the user you would like the history of
 */
export function useGetHistory(address: string) {
  const { wallet } = useAppContext();
    
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [history, setHistory] = useState<HistoricalTransaction[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
    
  const refresh = async () => {
    // wallet should never be undefined, since you can't get to user
    // history without being logged in
    getHistoryAsync(wallet!, address, setIsLoading, setHistory, setErrorMessage);
  };
    
  useEffect(() => {
  
    // initial data load
    refresh();
  
    // if it's the user's own addres, set an interval 
    // to refresh it every 10 seconds
    if (wallet?.address === address) {
      const interval = setInterval(refresh, 10000);
      return () => clearInterval(interval);
    }
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    
  return { isLoading, history, refresh, errorMessage };
}
  
const getHistoryAsync = async (
  wallet: Wallet,
  userAddress: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setHistory: React.Dispatch<React.SetStateAction<HistoricalTransaction[]>>,
  setErrorMessage:  React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  
  setIsLoading(true);
  
  try {
    const twoishWeeksAgo = await ETHERSCAN_PROVIDER.getBlockNumber() - TWOISHWEEKS;
    const transactions = await ETHERSCAN_PROVIDER.getHistory(userAddress, twoishWeeksAgo);
  
    const filtered = transactions.filter((t) => {
      return t.value !== '0' &&                               // no value
        t.txreceipt_status === '1' &&                         // unsuccessful
        t.to.toUpperCase() !== REQUESTS_ADDRESS.toUpperCase();// transfers to the requests contract
    });

    // get fulfilled requests and add those to the array as well
    const requestsHistory = await getRequestsArray(wallet, userAddress, 'fulfillments');
    
    const merged = filtered.concat(requestsHistory)
      .sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp));

    setHistory(merged);
    setErrorMessage(undefined);

  } catch (e) {
    setErrorMessage('Network Error.');
  } finally {
    setIsLoading(false);
  }
};