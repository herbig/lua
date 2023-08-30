import { ethers } from 'ethers';
import { useAppContext } from '../AppProvider';
import { useCallback, useEffect, useState } from 'react';
import { CHAIN_ID, PROVIDER } from '../constants';
import { useAppToast } from './theme';
import V5EtherscanProvider, { HistoricalTransaction } from './V5EtherscanProvider';

/**
 * Gets the currently logged in user's send / receive history.
 * 
 * Also provides fields for the initial loading or error state of
 * the data fetching, as well as a refresh function to do it again.
 */
export function useGetHistory() {
  const { wallet } = useAppContext();
  const [history, setHistory] = useState<HistoricalTransaction[]>();
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  // TODO this also should be refreshing on a timer
  const refresh = async () => {
    if (!wallet) {
      setError(new Error('Logged out.'));
      return;
    }
    const transactions = await (new V5EtherscanProvider(CHAIN_ID, process.env.REACT_APP_API_KEY_ETHERSCAN)).getHistory(wallet.address);
    const filtered = transactions.filter((t) => {
      if (t.value && t.value !== '0' && t.txreceipt_status === '1') {
        return true;
      }
      return false;
    });
    setHistory(filtered);
    console.log('done refreshing');
  };
  
  useEffect(() => {
    const getHistory = async () => {
      if (!wallet) {
        setError(new Error('Logged out.'));
        setInitialLoading(false);
        return;
      }
      const transactions = await (new V5EtherscanProvider(CHAIN_ID, process.env.REACT_APP_API_KEY_ETHERSCAN)).getHistory(wallet.address);
      const filtered = transactions.filter((t) => {
        if (t.value && t.value !== '0' && t.txreceipt_status === '1') {
          return true;
        }
        return false;
      });
      setHistory(filtered);
      setInitialLoading(false);
      console.log('done loading');
    };
    getHistory().catch((e: Error) => {
      setError(e);
      setInitialLoading(false);
    });
  }, [wallet]);

  return { history, initialLoading, refresh, error };
}

/**
 * Sends eth to a given address, using the currently logged in user
 * as the signer.
 * 
 * This will require that the current user have enough eth to send, in
 * addition to gas costs.
 */
export function useSendEth() {
  const { wallet, setProgressMessage } = useAppContext();
  const [error, setError] = useState<Error>();
  const toast = useAppToast();

  const sendEth = useCallback((toAddress: string, ethAmount: number) => {
    const sendEth = async () => {
      if (!wallet) {
        setError(new Error('Logged out.'));
        return;
      }

      setProgressMessage('Sending Cash');

      await (await wallet.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(ethAmount.toString())
      })).wait();

      toast('Success!');
      setProgressMessage(undefined);
    };

    sendEth().catch((e: Error) => {
      setError(e);
      toast('Whoops, something went wrong.', true);
      setProgressMessage(undefined);
    });
  }, [setProgressMessage, toast, wallet]);

  return { sendEth, error };
}

/**
 * Gets the Eth balance for the current chain of the given address.
 * 
 * TODO this also should be refreshing on a timer
 */
export function useGetEthBalance(address: string | undefined) {
  const [ethBalance, setEthBalance] = useState<string>();
  const [error, setError] = useState<Error>();
  useEffect(() => {
    if (!address) {
      setError(new Error('No address provided.'));
      return;
    }
    const getBalance = async () => {
      const balance = await ethers.getDefaultProvider(PROVIDER).getBalance(address);
      setEthBalance(ethers.formatEther(balance.toString()));
    };
    getBalance().catch(setError);
  }, [address]);
  return { ethBalance, error };
}

/**
 * Returns a number cut to two decimal places, from the given eth amount string.
 */
export function cutToCents(ethAmount?: string): number {
  return ethAmount ? Number(ethAmount.substring(0, ethAmount.indexOf('.') + 3)) : 0;
}

/**
 * Displays the given "eth" amound as USD, to the nearest cent.
 * This app is intended to for Gnosis Chain, so we're making the
 * assumption that 1 eth = $1, throughout the app.
 */
export function displayAmount(ethAmount?: string | number): string {
  return '$' + cutToCents(ethAmount?.toString()).toFixed(2);
}

/**
 * Returns a truncated eth address in the familiar '0x123...456' form.
 */
export function truncateEthAddress(address: string): string {
  return address.substring(0, 5) + '...' + address.substring(address.length - 3);
}
