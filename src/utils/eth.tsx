import { ethers } from 'ethers';
import { useState, useCallback, useEffect } from 'react';
import { useAppContext } from '../AppProvider';
import { useAppToast } from './ui';


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
      if (!wallet) return;

      setProgressMessage('Sending Cash');

      await (await wallet.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(ethAmount.toString())
      })).wait();

      toast('Success!');
      setProgressMessage(undefined);
    };

    sendEth().catch((e) => {
      setError(e);
      toast('Whoops, something went wrong.');
      setProgressMessage(undefined);
    });
  }, [setProgressMessage, toast, wallet]);

  return { sendEth, error };
}

/**
 * Gets the Eth balance for the current chain of the given address.
 */
export function useGetEthBalance(address: string | undefined) {
  const [ethBalance, setEthBalance] = useState<string>('0');
  const { provider } = useAppContext();
  
  useEffect(() => {
    const refresh = () => {
      if (!address) {
        setEthBalance('0');
        return;
      }

      const getBalance = async () => {
        const weiBalance = await provider.getBalance(address);
        setEthBalance(ethers.formatEther(weiBalance.toString()));
      };

      getBalance().catch();
    };

    refresh();

    const interval = setInterval(refresh, 5000);

    return () => clearInterval(interval);
  }, [address, provider]);

  return ethBalance;
}

/**
 * Returns a number cut to two decimal places, from the given eth amount string.
 */
export function cutToCents(ethAmount?: string): number {
  return ethAmount ? Number(ethAmount.substring(0, ethAmount.indexOf('.') + 3)) : 0;
}

/**
 * Displays the given "eth" amount as USD, to the nearest cent.
 * This app is intended for Gnosis Chain, so we're making the
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

/** 
 * Generates and returns a new random private key.
 */
export function newWallet(): string {
  return ethers.Wallet.createRandom().privateKey;
}

export function useFaucet() {
  const { ethBalance, wallet, provider, setProgressMessage } = useAppContext();
  const [allowFaucet, setAllowFaucet] = useState<boolean>(Number(ethBalance) === 0);
  const toast = useAppToast();

  const tap = useCallback(() => {
    const sendEth = async () => {
      if (!wallet || !allowFaucet) return;

      setProgressMessage('Tapping Faucet');

      // this will get drained eventually, ha
      const faucet = new ethers.Wallet(process.env.REACT_APP_FAUCET || '', provider);
      
      await (await faucet.sendTransaction({
        to: wallet.address,
        value: ethers.parseEther('0.25')
      })).wait();

      toast('Success!');

      setAllowFaucet(false);

      setProgressMessage(undefined);
    };

    sendEth().catch(() => {
      toast('Whoops, something went wrong.');
      setProgressMessage(undefined);
    });
  }, [allowFaucet, provider, setProgressMessage, toast, wallet]);

  return { tap, allowFaucet };
}

// Cutting 1 cent from the max amount allowable to send.
// Before gas subsidizing, this is a simple way to never deal with
// gas issues, just prevent sending your whole balance, conveniently
// leaving well over enough to cover gas costs.
export function workableEth(ethBalance: string) {
  return cutToCents(Math.max(Number(ethBalance) - 0.01, 0).toString());
}