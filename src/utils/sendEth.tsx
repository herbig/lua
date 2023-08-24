import { ethers } from 'ethers';

const CHAIN = 'goerli';

export function sendEth(toAddress: string, ethAmount: number) {
  
  const wallet = new ethers.Wallet(process.env.REACT_APP_TEST_PRIVATE_KEY || '', ethers.getDefaultProvider(CHAIN));

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