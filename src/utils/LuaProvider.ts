import { BlockTag, EtherscanProvider } from 'ethers';

/**
 * Custom provider which handles aspects of Lua Wallet.
 */
export default class LuaProvider extends EtherscanProvider {

  static CHAIN_ID = 100;

  constructor() {
    super(LuaProvider.CHAIN_ID, process.env.REACT_APP_API_KEY_GNOSISSCAN);
  }
  
  /**
   * Gets a user's Eth send / receive history, via the Etherscan API.
   */
  async getUserHistory(address: string, startBlock?: BlockTag, endBlock?: BlockTag): Promise<HistoricalTransaction[]> {
    const params = {
      action: 'txlist',
      address,
      startblock: ((startBlock == null) ? 0 : startBlock),
      endblock: ((endBlock == null) ? 99999999 : endBlock),
      sort: 'desc'
    };
    return this.fetch('account', params);
  }

  override getBaseUrl(): string {
    // overridden to add support for xdai / Gnosis Chain
    if (this.network.name === 'xdai') {
      return 'https://api.gnosisscan.io';
    } else {
      return super.getBaseUrl();
    }
  }
}

/**
 * Only pulling what we actually need here.
 * Log the result if you're looking to add something else.
 */
export type HistoricalTransaction = {
    from: string;             // Eth address
    to: string;               // Eth address
    input: string;            // arbitrary ABI encoded data
    value: string;            // value in wei
    timeStamp: string;        // 10-digit epoch time (seconds)
    txreceipt_status: string; // 1 (success) or 0 (failed)
}