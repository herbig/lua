import { ethers } from 'ethers';
import { useState, useCallback, useEffect } from 'react';
import { useUser } from '../providers/UserProvider';
import { useAppToast } from './ui';
import { addFriendWeight } from './friends';
import { CacheExpiry, CacheKeys, getValue, setValue } from './cache';
import { useUI } from '../providers/UIProvider';

/**
 * Sends eth to a given address, using the currently logged in user
 * as the signer.
 * 
 * This will require that the current user have enough eth to send, in
 * addition to gas costs.
 */
export function useSendEth() {
  const { provider, wallet } = useUser();
  const { setProgressMessage, triggerRefresh } = useUI();
  const toast = useAppToast();

  const sendEth = useCallback((toAddress: string, message: string | undefined, ethAmount: number) => {
    const sendEth = async () => {
      if (!wallet) return;

      setProgressMessage('Sending Cash...');

      await (await wallet.sendTransaction({
        to: toAddress,
        data: message ? provider.abiEncode(message) : undefined,
        value: ethers.parseEther(ethAmount.toString())
      })).wait();

      toast('Success!');

      addFriendWeight(toAddress);

      setProgressMessage(undefined);

      triggerRefresh();
    };

    sendEth().catch(() => {
      toast('Whoops, something went wrong.');
      setProgressMessage(undefined);
    });
  }, [wallet, setProgressMessage, provider, toast, triggerRefresh]);

  return sendEth;
}

/**
 * Gets the eth balance for the given address and optionally calls to sync
 * it on an interval timer.
 */
export function useGetEthBalance(address: string | undefined, refreshIntervalSeconds?: number) {
  const [ethBalance, setEthBalance] = useState<string>('0');
  const { provider } = useUser();
  
  useEffect(() => {
    const refresh = () => {
      if (!address) {
        setEthBalance('0');
        return;
      }

      const getBalance = async () => {
        try {
          const weiBalance = await provider.getBalance(address);
          setEthBalance(ethers.formatEther(weiBalance.toString()));
        } catch (e) {
          // do nothing, it will keep the previously set value for now
        }
      };

      getBalance();
    };

    refresh();

    if (refreshIntervalSeconds && refreshIntervalSeconds > 0) {
      const interval = setInterval(refresh, refreshIntervalSeconds * 1000);
      return () => clearInterval(interval);
    }
  }, [address, provider, refreshIntervalSeconds]);

  return ethBalance;
}

/**
 * Returns a number cut to two decimal places, from the given eth amount string.
 */
export function cutToCents(ethAmount?: string): number {
  return ethAmount ? parseFloat(parseFloat(ethAmount).toFixed(2)) : 0;
}

/**
 * Displays the given "eth" amount as USD, to the nearest cent.
 * This app is intended for Gnosis Chain, so we're making the
 * assumption that 1 eth = $1, throughout the app.
 */
export function ethDisplayAmount(ethAmount?: string | number): string {
  return '$' + cutToCents(ethAmount?.toString()).toFixed(2).replace(/[.,]00$/, '');
}

export function weiDisplayAmount(weiAmount?: string): string {
  return ethDisplayAmount(ethers.formatEther(weiAmount || '0'));
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

// TODO this whole onboarding thing is a hurried mess, scrap this and start over.
export function useFaucet() {
  const { ethBalance, wallet, provider } = useUser();
  const { setProgressMessage } = useUI();
  const balance = parseFloat(ethBalance);
  const [allowFaucet, setAllowFaucet] = useState<boolean>(wallet && balance === 0 && getValue(CacheKeys.ALLOW_FAUCET));
  const toast = useAppToast();

  useEffect(() => {
    const allowFaucet = wallet && balance === 0 && getValue(CacheKeys.ALLOW_FAUCET);
    setAllowFaucet(allowFaucet);
    if (balance !== 0) {
      // we can set this to never if they have a balance
      setValue(CacheKeys.ALLOW_FAUCET, false, CacheExpiry.NEVER);
    }
  }, [balance, ethBalance, wallet]);

  const tap = useCallback(() => {
    const sendEth = async () => {
      if (!wallet || !allowFaucet) return;

      setProgressMessage('Getting Cash...');

      // this will get drained eventually, ha
      const faucet = new ethers.Wallet(process.env.REACT_APP_FAUCET || '', provider);
      
      await (await faucet.sendTransaction({
        to: wallet.address,
        value: ethers.parseEther('0.25')
      })).wait();

      toast('Success!');

      setAllowFaucet(false);
      setValue(CacheKeys.ALLOW_FAUCET, false, CacheExpiry.NEVER);

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
  return cutToCents(Math.max(parseFloat(ethBalance) - 0.01, 0).toString());
}

export const isValidKey = (key: string): boolean => {
  try {
    new ethers.Wallet(key);
    return true;
  } catch (e) {
    return false;
  }
};