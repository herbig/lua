import { Web3AuthNoModal } from '@web3auth/no-modal';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WALLET_ADAPTERS } from '@web3auth/base';
import { useCallback } from 'react';
import { useAppContext } from '../providers/AppProvider';
import { useAppToast } from './ui';

// TODO putting this on goerli for now, since all we want / need is a private key
const CLIENT_ID = 'BIr57Q4Fdt7dmJVrRgkW5bUTbjRV7sxJamqChw4hxEUFrMRU57F9sLwSnutEqFZLk1mnQ4krJvRzvVFTdMuoMoc';
const WEB3_AUTH_NETWORK = 'testnet';
const CHAIN = 5;
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x' + CHAIN.toString(16),
  rpcTarget: 'https://rpc.ankr.com/eth_goerli',
  displayName: 'Goerli Testnet',
  blockExplorer: 'https://goerli.etherscan.io',
  ticker: 'ETH',
  tickerName: 'Ethereum'
};

class Web3Auth {
  private static _instance: Web3Auth;

  private web3auth: Web3AuthNoModal;
  private loginProvider: SafeEventEmitterProvider | null = null;

  private constructor() {
    this.web3auth = new Web3AuthNoModal({
      clientId: CLIENT_ID,
      web3AuthNetwork: WEB3_AUTH_NETWORK,
      chainConfig: chainConfig,
      enableLogging: false
    });

    const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
    const adapter = new OpenloginAdapter({ privateKeyProvider });
    this.web3auth.configureAdapter(adapter);

    this.web3auth.init();
  }

  static get Instance() {
    return this._instance || (this._instance = new this());
  }

  async logIn(email: string) {
    try {
      this.loginProvider = await this.web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: 'email_passwordless',
        extraLoginOptions: {
          login_hint: email
        }
      });
    } catch (e) {
      return;
    }
  }

  isLoggedIn() { 
    return this.web3auth.connected;
  }

  async logOut() {
    await this.web3auth.logout();
    this.loginProvider = null;
  }

  async getPrivateKey(): Promise<string> {
    const key = await this.loginProvider?.request<string>({
      method: 'eth_private_key'
    });
    return key as string;
  }
}

export function usePasswordlessLogIn() {
  const { setUser, setProgressMessage } = useAppContext();
  const toast = useAppToast();
  
  // calling before login ensures it's initialized before use
  const web3Auth = Web3Auth.Instance;

  const logIn = useCallback((email: string) => {
    const process = async () => {

      setProgressMessage('Waiting for email confirmation...');

      await web3Auth.logIn(email);

      if (web3Auth.isLoggedIn()) {

        const key = await web3Auth.getPrivateKey();

        if (key) {
          toast('Welcome!');
          setUser(key);
        } else {
          toast('Login failed...');
        }

        // we don't need this anymore
        web3Auth.logOut();
      } else {
        toast('Login failed...');
      }
    };
    try {
      process();
    } catch (e) {
      toast('Login failed...');
    } finally {
      setProgressMessage(undefined);
    }
  }, [setProgressMessage, setUser, toast, web3Auth]);

  return logIn;
}