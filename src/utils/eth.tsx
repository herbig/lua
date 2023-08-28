import { BlockTag, EtherscanProvider, Networkish, ethers } from 'ethers';
import { useAppContext } from '../AppProvider';
import { useCallback, useEffect, useState } from 'react';
import { PROVIDER } from '../constants';

// https://ethereum.stackexchange.com/a/150836
export type HistoricalTransaction = {
  from: string;
  to: string;
  value: string; // value: '163225741820703280'
  timeStamp: string; // timeStamp: '1668722061'
  functionName: string;
  contractAddress: string;
  txreceipt_status: string; // txreceipt_status: '1'
}

/**
 * Ethers v6 doesn't implement the getHistory function, so this was lifted
 * from Stack Overflow. Thanks Anarkrypto.
 * 
 * https://ethereum.stackexchange.com/a/150836
 */
export default class V5EtherscanProvider extends EtherscanProvider {

  constructor(networkish: Networkish, apiKey?: string) {
    super(networkish, apiKey);
  }

  async getHistory(address: string, startBlock?: BlockTag, endBlock?: BlockTag): Promise<HistoricalTransaction[]> {
    const params = {
      action: 'txlist',
      address,
      startblock: ((startBlock == null) ? 0 : startBlock),
      endblock: ((endBlock == null) ? 99999999 : endBlock),
      sort: 'desc'
    };
    return this.fetch('account', params);
  }
}

export function useGetHistory() {
  const { wallet } = useAppContext();
  const [history, setHistory] = useState<HistoricalTransaction[]>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const getHistory = async () => {
      if (!wallet) {
        setError(new Error('Logged out.'));
        return;
      }
      const etherscan = new V5EtherscanProvider(5); // TODO add Etherscan API key
      const history: HistoricalTransaction[] = await etherscan.getHistory(wallet.address);
      setHistory(history);
    };

    getHistory().catch((e: Error) => {
      setError(e);
    });
  }, [wallet]);

  return { history, error };
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

      setProgressMessage(undefined);
    };

    sendEth().catch((e: Error) => {
      setError(e);
      setProgressMessage(undefined);
    });
  }, [setProgressMessage, wallet]);

  return { sendEth, error };
}

/**
 * Gets the Eth balance for the current chain of the given address.
 * 
 * TODO this should be refreshing on a timer??
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

export function displayAmount(ethAmount?: string | number): string {
  return '$' + cutToCents(ethAmount?.toString()).toFixed(2);
}

export function truncateEthAddress(address: string): string {
  return address.substring(0, 5) + '...' + address.substring(address.length - 3);
}