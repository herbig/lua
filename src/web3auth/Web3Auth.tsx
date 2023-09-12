import { Web3AuthNoModal } from '@web3auth/no-modal';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WALLET_ADAPTERS } from '@web3auth/base';
import { useCallback } from 'react';
import { useAppContext } from '../AppProvider';
import { useAppToast } from '../utils/ui';
import { WEB3_AUTH_CLIENT_ID } from '../constants';

// const chainConfig = {
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   chainId: '0x' + CHAIN_ID.toString(16),
//   rpcTarget: PROVIDER,
//   displayName: CHAIN_NAME,
//   blockExplorer: CHAIN_ID === 5 ? 'https://goerli.etherscan.io/' : 'https://gnosisscan.io/',
//   ticker: ETH_NAME,
//   tickerName: ETH_NAME
// };

// TODO putting this on goerli for now, since all we want / need is a private key
const chain = 5;
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x' + chain.toString(16),
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
      clientId: WEB3_AUTH_CLIENT_ID,
      web3AuthNetwork: 'testnet',
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

  async logOut() {
    await this.web3auth.logout();
    this.loginProvider = null;
  }

  isLoggedIn() {
    return this.web3auth.connected;
  }

  async getPrivateKey(): Promise<any> {
    const key = await this.loginProvider?.request({
      method: 'eth_private_key'
    });
    return key;
  }
}

const web3Auth = Web3Auth.Instance;

export function usePasswordlessLogIn() {
  const { setUser, setProgressMessage } = useAppContext();
  const toast = useAppToast();
  
  const logIn = useCallback((email: string) => {
    const process = async () => {

      setProgressMessage('Waiting for email confirmation...');

      await web3Auth.logIn(email);

      if (web3Auth.isLoggedIn()) {

        const key: string = await web3Auth.getPrivateKey();

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
      
      setProgressMessage(undefined);
    };
    try {
      process();
    } catch (e) {
      toast('Login failed...');
      setProgressMessage(undefined);
    }
  }, [setProgressMessage, setUser, toast]);

  return logIn;
}