type Chain = {
    id: number,
    chainName: string,
    ethName: string,
    etherscanApiKey: string,
    rpc: string,
    requestsContract: string,
    nameRegistryContract: string,
    userValuesContract: string,
};

// keeping support for Goerli for future automated tests or something
const USE_GNOSIS = true;

export const CHAIN: Chain = USE_GNOSIS ? 
  {
    id: 100,
    chainName: 'Gnosis Chain',
    ethName: 'xDai',
    etherscanApiKey: process.env.REACT_APP_API_KEY_GNOSISSCAN!,
    // TODO non public RPC, doesn't look like Infura supports 
    // GC but https://www.quicknode.com/ does
    rpc: 'https://rpc.gnosis.gateway.fm',
    requestsContract: '0x77AE090463E47AFe9e33182a8C020fAD239Dd788',
    nameRegistryContract: '0x487b88949305bd891337e34ed35060dac42b8535',
    userValuesContract: '0x1EB4beEc0DB7fc25b84b62c36b0483eb40e65557'
  } : 
  {
    id: 5,
    chainName: 'Goerli',
    ethName: 'Goerli Eth',
    etherscanApiKey: process.env.REACT_APP_API_KEY_ETHERSCAN!,
    rpc: 'https://rpc.ankr.com/eth_goerli',
    requestsContract: '0x9B3DB51c73E27C25bd19bE7af3e4D128C8ad9b36',
    nameRegistryContract: '0xd78fdaf7aa9d73dbd8b3b96cc842315f6e63e053',
    userValuesContract: '0xde4Ecc89d8D5Cb11AaAfa67FC1c3972503aB0021'
  };