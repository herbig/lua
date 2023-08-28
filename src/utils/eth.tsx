import { ethers } from 'ethers';
import { useAppContext } from '../AppProvider';
import { useCallback, useEffect, useState } from 'react';

const CHAIN = 'goerli';

export function sendEth(toAddress: string, ethAmount: number) {
  const { key } = useAppContext();

  if (!key) {
    // TODO error handling
    return;
  }

  const wallet = new ethers.Wallet(key, ethers.getDefaultProvider(CHAIN));

  // TODO make async
  try{
    wallet.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(ethAmount.toString())
    })
      .then((txObj) => {
        console.log('txHash', txObj.hash);
      });
  } catch (e) {
    console.log('error', e);
  }
}

export function useSendEth() {
  const { key } = useAppContext();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  const sendEth = useCallback((toAddress: string, ethAmount: number) => {
    const sendEth = async () => {
      if (!key) {
        setError(new Error('Logged out.'));
        return;
      }

      setIsSending(true);

      const wallet = new ethers.Wallet(key, ethers.getDefaultProvider(CHAIN));

      await wallet.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(ethAmount.toString())
      }).then((txObj) => {
        console.log('txHash', txObj.hash);
        // TODO wait until the transaction is confirmed, *then*
        // set isSending to false
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

export function useGetEthBalance(address: string) {
  const [balance, setBalance] = useState<string>();
  const [error, setError] = useState<Error>();
  useEffect(() => {
    const getBalance = async () => {
      const balance = await ethers.getDefaultProvider(CHAIN).getBalance(address);
      setBalance(ethers.formatEther(balance.toString()));
    };
    getBalance().catch(setError);
  }, []);
  return { balance, error };
}