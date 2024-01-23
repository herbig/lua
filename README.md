# Lua Wallet

Lua is a proof of concept static React app built to mimic Venmo style payment apps, using the xDAI stablecoin under the hood.  The overall goal is to abstract away as much of the blockchain aspects as possible, while staying true to the trustless, self-custodial ethos of Ethereum.

Users can log in using their email address using [Web3Auth](https://web3auth.io/) or a private key, and will be required to register a unique on-chain username which can be used to send, request, and receive payments on the app.

As transactions are very cheap on Gnosis Chain, "gas abstraction" is achieved simply by not allowing the user to send their entire balance, keeping 1 cent in reserve at all times, once they have a balance.

Users can also request payment from another user, via a custom Solidity smart contract, which creates a payment queue that will appear for the other user, to ignore or fulfill as they see fit.  Payments and requests also include an optional message, similar to Venmo/CashApp payments.

You can check out the deployed app at https://luawallet.netlify.app/, however as this not audited please do not use a hot wallet with significant funds on any EVM chain.  The app itself will provide new users with 0.25 to test with.

The app is named after my dog [Lua](https://www.instagram.com/luathepup/Lua).

## Testing locally

### `npm start`

Will run the app in the development mode at [http://localhost:3000](http://localhost:3000).

Infura and GnosisScan API keys will be required in your `.env.local` settings.
