import { ethers } from 'ethers';

const CHAIN = 'goerli';

// TODO don't hardcode address
// 0x7ea30CE56a67Aa5dc19b34242db1B97927Bf850b
// https://www.npmjs.com/package/react-secure-storage

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