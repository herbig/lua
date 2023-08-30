// gosh I hate a global constants file, but React doesn't seem to have a great
// way to use dependency injection, so dropping things here for now.
// I also don't see a good reason to overload .env with stuff, rather
// than setting these dynamically based on prod vs. dev

export const PROVIDER = 'https://rpc.ankr.com/eth_goerli';
export const CHAIN_ID = 5;
