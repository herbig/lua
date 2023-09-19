import { ethers } from 'ethers';
import { useState, useCallback, useEffect } from 'react';
import { useAppContext } from '../providers/AppProvider';
import { useAppToast } from './ui';
import { addFriendWeight } from './friends';
import { utils } from 'ethersv5';
import { CacheExpiry, CacheKeys, getValue, setValue } from './cache';

const ABI_ENCODER = new utils.AbiCoder();

// local memory cache of decoded data
const decodedMap = new Map<string, string>();

export function abiDecode(encoded: string) {
  const cached = decodedMap.get(encoded);
  if (cached !== undefined) return cached;
  
  let decoded = '';

  try {
    decoded = ABI_ENCODER.decode(['string'], encoded).toString();
  } catch (e) {
    // just leave it as ''
  } finally {
    decodedMap.set(encoded, decoded);
  }

  return decoded;
}

export function abiEncode(uncoded: string) {
  let encoded = '';

  try {
    encoded = ABI_ENCODER.encode(['string'], [uncoded]);
  } catch (e) {
    // just leave it as ''
  } finally {
    decodedMap.set(encoded, uncoded);
  }

  return encoded;
}

/**
 * Sends eth to a given address, using the currently logged in user
 * as the signer.
 * 
 * This will require that the current user have enough eth to send, in
 * addition to gas costs.
 */
export function useSendEth() {
  const { wallet, setProgressMessage, triggerRefresh } = useAppContext();
  const toast = useAppToast();

  const sendEth = useCallback((toAddress: string, message: string | undefined, ethAmount: number) => {
    const sendEth = async () => {
      if (!wallet) return;

      setProgressMessage('Sending Cash...');

      await (await wallet.sendTransaction({
        to: toAddress,
        data: message ? abiEncode(message) : undefined,
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
  }, [setProgressMessage, toast, wallet, triggerRefresh]);

  return sendEth;
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
        try {
          const weiBalance = await provider.getBalance(address);
          setEthBalance(ethers.formatEther(weiBalance.toString()));
        } catch (e) {
        // currently just doing background syncs, so do nothing here
        }
      };

      getBalance();
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
  const { ethBalance, wallet, provider, setProgressMessage } = useAppContext();
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

      // TODO we need better state management, the user's name
      // should be placed in the app provider, and use a reducer
      // or something so that when it changes this will go away
      // automatically
      window.location.reload();
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