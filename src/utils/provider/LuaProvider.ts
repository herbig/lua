import { BlockTag, JsonRpcProvider } from 'ethers';
import { utils } from 'ethersv5';
import { CHAIN } from '../chains';
import { HistoricalTransaction, V5EtherscanProvider } from './V5EtherscanProvider';

/**
 * Custom provider which handles blockchain interaction aspects of Lua Wallet.
 */
export class LuaProvider extends JsonRpcProvider {

  private etherscanProvider = new V5EtherscanProvider(CHAIN.id, CHAIN.etherscanApiKey);

  private encoder = new utils.AbiCoder();
  
  // local memory cache of decoded data TODO is this even necessary?
  private decodedMap = new Map<string, string>();

  constructor() {
    super(CHAIN.rpc);
  }
  
  async getUserHistory(address: string, startBlock?: BlockTag, endBlock?: BlockTag): Promise<HistoricalTransaction[]> {
    return this.etherscanProvider.getUserHistory(address, startBlock, endBlock);
  }

  abiDecode(encoded: string) {
    const cached = this.decodedMap.get(encoded);
    if (cached !== undefined) return cached;
  
    let decoded = '';

    try {
      decoded = this.encoder.decode(['string'], encoded).toString();
    } catch (e) {
    // just leave it as ''
    } finally {
      this.decodedMap.set(encoded, decoded);
    }

    return decoded;
  }

  abiEncode(uncoded: string) {
    let encoded = '';

    try {
      encoded = this.encoder.encode(['string'], [uncoded]);
    } catch (e) {
    // just leave it as ''
    } finally {
      this.decodedMap.set(encoded, uncoded);
    }

    return encoded;
  }
}