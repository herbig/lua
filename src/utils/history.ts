import V5EtherscanProvider from './V5EtherscanProvider';
import { REQUESTS_ADDRESS, getRequestsArray } from './requests';
import { Wallet } from 'ethers';

const ETHERSCAN_PROVIDER = new V5EtherscanProvider();

// TODO history should eventually be paginated, but for now it's taking the last
// two weeks, assuming a 5 second block time for Gnosis Chain
const TWOISHWEEKS = (86400 * 14) / 5;
  
export const getHistoryAsync = (
  wallet: Wallet,
  userAddress: string
) => {
  return async () => {
    // TODO pagination instead of only 2 weeks worth...
    const twoishWeeksAgo = await ETHERSCAN_PROVIDER.getBlockNumber() - TWOISHWEEKS;
    const transactions = await ETHERSCAN_PROVIDER.getHistory(userAddress, twoishWeeksAgo);
  
    const filtered = transactions.filter((t) => {
      return t.value !== '0' &&                               // no value
        t.txreceipt_status === '1' &&                         // unsuccessful
        t.to.toUpperCase() !== REQUESTS_ADDRESS.toUpperCase();// transfers to the Lua requests contract
    });

    // get fulfilled requests and add those to the array as well
    const requestsHistory = await getRequestsArray(wallet, userAddress, 'fulfillments');
    
    // merge and sort
    const merged = filtered.concat(requestsHistory)
      .sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp));

    return merged;
  };
};