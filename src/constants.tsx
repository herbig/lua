// gosh I hate a global constants file, but React doesn't seem to have a great
// way to do dependency injection, so dropping things here for now.
// I also don't see a good reason to overload .env with stuff, rather
// than setting these dynamically based on prod vs. dev

const FORCE_GNOSIS = true;

export const CHAIN_ID = !FORCE_GNOSIS && process.env.NODE_ENV === 'development' ? 
  5 : 100;

export const PROVIDER = CHAIN_ID === 5 ? 
  'https://rpc.ankr.com/eth_goerli' : 'https://rpc.gnosis.gateway.fm';

export const CHAIN_NAME = CHAIN_ID === 5 ? 
  'Goerli' : 'Gnosis Chain';

export const ETH_NAME = CHAIN_ID === 5 ? 
  'Goerli Eth' : 'xDai';

export const REGISTRY_ADDRESS = CHAIN_ID === 5 ? 
  '0xd78fdaf7aa9d73dbd8b3b96cc842315f6e63e053' : '0x487b88949305bd891337e34ed35060dac42b8535';

export const REGISTRY_ABI = [
  {
    name: 'registerName',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { internalType: 'string', name: '_name', type: 'string' }
    ],
    outputs: []
  },
  {
    name: 'addressToName',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { internalType: 'address', name: '', type: 'address' }
    ],
    outputs: [{
      'internalType': 'string',
      'name': '',
      'type': 'string'
    }]
  },
  {
    name: 'nameToAddress',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { internalType: 'string', name: '', type: 'string' }
    ],
    outputs: [{
      'internalType': 'address',
      'name': '',
      'type': 'address'
    }]
  }
];

// TODO whitelist deployed URL https://dashboard.web3auth.io/home/web3auth
export const WEB3_AUTH_CLIENT_ID = 'BIr57Q4Fdt7dmJVrRgkW5bUTbjRV7sxJamqChw4hxEUFrMRU57F9sLwSnutEqFZLk1mnQ4krJvRzvVFTdMuoMoc';
export const AUTH0_DOMAIN = 'https://dev-4elqbiwwyzsv3a4v.us.auth0.com';
export const AUTH0_CLIENT_ID = '6FOSoWHjCH2tHZWppCUT2w35MKt5v7hB';