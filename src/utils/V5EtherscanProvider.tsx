import { BlockTag, EtherscanProvider, Networkish } from 'ethers';

/**
 * Ethers v6 doesn't implement the old getHistory function, so this was lifted
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

/**
 * Only pulling what we actually need here. For a full list of available fields, 
 * check the source: https://ethereum.stackexchange.com/a/150836
 */
export type HistoricalTransaction = {
    from: string;             // Eth address
    to: string;               // Eth address
    value: string;            // value in wei
    timeStamp: string;        // 10-digit epoch time (seconds)
    txreceipt_status: string; // 1 (success) or 0 (failed)
}