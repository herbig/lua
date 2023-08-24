import { ethers } from 'ethers';
import { useAppContext } from '../AppProvider';

const CHAIN = 'goerli';

export function sendEth(toAddress: string, ethAmount: number) {
  const { key } = useAppContext();

  if (!key) {
    // TODO error handling
    return;
  }

  const wallet = new ethers.Wallet(key, ethers.getDefaultProvider(CHAIN));

  try{
    wallet.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(ethAmount.toString())
    })
      .then((txObj) => {
        console.log('txHash', txObj.hash);
      });
  } catch (e) {
    console.log('error', e);
  }
}