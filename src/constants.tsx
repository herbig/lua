// gosh I hate a global constants file, but React doesn't seem to have a great
// way to use dependency injection, so dropping things here for now.
// I also don't see a good reason to overload .env with stuff, rather
// than setting these dynamically based on prod vs. dev

export const PROVIDER = 'https://rpc.ankr.com/eth_goerli';
export const CHAIN_ID = 5;
// TODO whitelist deployed URL https://dashboard.web3auth.io/home/web3auth
export const WEB3_AUTH_CLIENT_ID = 'BIr57Q4Fdt7dmJVrRgkW5bUTbjRV7sxJamqChw4hxEUFrMRU57F9sLwSnutEqFZLk1mnQ4krJvRzvVFTdMuoMoc';
export const AUTH0_DOMAIN = 'https://dev-4elqbiwwyzsv3a4v.us.auth0.com';
export const AUTH0_CLIENT_ID = '6FOSoWHjCH2tHZWppCUT2w35MKt5v7hB';