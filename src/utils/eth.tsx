import { ethers } from 'ethers';
import { useAppContext } from '../AppProvider';
import { useCallback, useEffect, useState } from 'react';
import { CHAIN } from '../constants';

/**
 * Sends eth to a given address, using the currently logged in user
 * as the signer.
 * 
 * This will require that the current user have enough eth to send, in
 * addition to gas costs.
 */
export function useSendEth() {
  const { wallet } = useAppContext();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  const sendEth = useCallback((toAddress: string, ethAmount: number) => {
    const sendEth = async () => {
      if (!wallet) {
        setError(new Error('Logged out.'));
        return;
      }

      setIsSending(true);

      await wallet.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(ethAmount.toString())
      }).then((txResponse) => {
        console.log('txHash', txResponse.hash);
        setIsSending(false);
      });
    };
    sendEth().catch((e: Error) => {
      setError(e);
      setIsSending(false);
    });
  }, []);

  return { sendEth, isSending, error };
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
      const balance = await ethers.getDefaultProvider(CHAIN).getBalance(address);
      setEthBalance(ethers.formatEther(balance.toString()));
    };
    getBalance().catch(setError);
  }, []);
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