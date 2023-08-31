import { Web3AuthNoModal } from '@web3auth/no-modal';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { PROVIDER, WEB3_AUTH_CLIENT_ID, CHAIN_ID } from './constants';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WALLET_ADAPTERS } from '@web3auth/base';
import { ethers } from 'ethersv5';

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x' + CHAIN_ID.toString(16),
  rpcTarget: PROVIDER,

  displayName: 'Goerli', // TODO make dynamic
  blockExplorer: 'https://goerli.etherscan.io/',
  ticker: 'GETH',
  tickerName: 'Goerli Eth'
};

class Web3Auth {
  private static _instance: Web3Auth;

  private web3auth: Web3AuthNoModal;
  private loginProvider: SafeEventEmitterProvider | null = null;

  private constructor() {
    this.web3auth = new Web3AuthNoModal({
      clientId: WEB3_AUTH_CLIENT_ID,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: '0x' + CHAIN_ID.toString(16),
        rpcTarget: PROVIDER
      },
      enableLogging: true // TODO
    });

    const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
    this.web3auth.configureAdapter(new OpenloginAdapter({ privateKeyProvider }));

    // TODO should we wait for this
    this.web3auth.init();

    this.isLoggedIn();
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async logIn(email: string) {
    this.loginProvider = await this.web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: 'email_passwordless',
      extraLoginOptions: {
        login_hint: email
      }
    });

    // TODO here for testing
    this.getUserDetails();
  }

  public async logOut() {
    await this.web3auth.logout();
    this.loginProvider = null;
  }

  public isLoggedIn() {
    console.log('web3auth ' + this.web3auth.connected);
    return this.web3auth.connected;
  }

  public async getUserDetails() {
    if (this.loginProvider === null) {
      // TODO error handling
      return;
    }

    const provider = new ethers.providers.Web3Provider(this.loginProvider, CHAIN_ID);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const email = (await this.web3auth.getUserInfo()).email;

    console.log('web3auth ' + email);
    console.log('web3auth ' + address);

    return { signer, address, email };
  }
}

export const web3Auth = Web3Auth.Instance;