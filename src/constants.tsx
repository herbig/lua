// gosh I hate a global constants file, but React doesn't seem to have a great
// way to do dependency injection, so dropping things here for now.
// I also don't see a good reason to overload .env with stuff, rather
// than setting these dynamically based on prod vs. dev

export const PROVIDER = process.env.NODE_ENV === 'development' ? 
  'https://rpc.ankr.com/eth_goerli' : 'https://rpc.gnosis.gateway.fm';

export const CHAIN_ID = process.env.NODE_ENV === 'development' ? 
  5 : 100;

export const CHAIN_NAME = CHAIN_ID === 5 ? 
  'Goerli' : 'Gnosis Chain';