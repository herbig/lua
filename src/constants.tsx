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