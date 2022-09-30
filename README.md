Sybil-resistant faucet is a generic browser-based faucet solution that can be used on any existing parachain (substrate-based chain, either pallets or ink! smart contracts).

## Getting Started

1. First, configure environment variables that are needed for user authentication, faucet wallet, etc. Copy `.env.sample` file into `.env.local` and `.env.test`, and start setting up the environment variables in both of these. The rationale behind different environments setup can be found in [Environments](#environments) section. Each variable and its setup is described in [Configuration](#configuration) section.

2. (optional) For local testing you may also want to set up a local Substrate node. Find instructions on [local blockchain setup](#local-blockchain-setup).

3. Once all environment variables are ready, run the development server:

```bash
npm run dev
# or
yarn dev
```

## Testing

Tests consist of unit, integration and E2E tests. 

### Unit & integration testing

Unit & integration tests are written in Jest, and can be run with:

```bash
npm run test:unit:integration
# or
yarn test:unit:integration
```

### End-to-end testing

End-to-end tests are written in Playwright, and can be run with:

```bash
npm run test:e2e
# or
yarn test:e2e
```

## Configuration

To make the faucet generic, many of its parts are configurable. Configuration settings are stored in `.env` files, one per each environment. Read more about environments and their setup in [environments](#environments) section.

| Variable | Description | Default |
| ------------- | ------------- | ------------- |
| `DRIP_CAP` | How many tokens to send per each claim. | `0.025` |
| `DRIP_DELAY` | How often user's can request to drip tokens (in seconds). | `86400 seconds (1 day)` |
| `REDIS_ENDPOINT` | Redis instance endpoint. It's the easiest to setup Redis instance at [Redis Cloud](https://redis.com/try-free/), or you may run a local blockchain. | *None* |
| `NETWORK_PROVIDER_ENDPOINT` | Substrate or Ink! based blockchain endpoint. Optionally, for testing purposes, read more on [local blockchain setup](#local-blockchain-setup). | `ws://127.0.0.1:9944` |
| `FAUCET_SECRET` | Mnemonic or secret seed of faucet's wallet from which funds will be drawn. Optionally, for testing purposes, read more on [local blockchain setup](#local-blockchain-setup). | `0xe5be9a509...` |
| `NETWORK_DECIMALS` | Decimal places used for network tokens. | `12` |
| `NEXTAUTH_URL` | Authentication endpoint. Must be set to the canonical URL of your site. Read more on [NextAuth.js documentation](https://next-auth.js.org/configuration/options#nextauth_url). | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Used to encrypt the JWT token. Read more on [NextAuth.js documentation](https://next-auth.js.org/configuration/options#nextauth_secret). | `set_random_string` |
| `TWITTER_CLIENT_ID` | Obtain Twitter OAuth2.0 client ID in [Twitter Developer Portal](https://developer.twitter.com/). Important note, while setting callback URL, make sure it is set to the canonical URL of your site, ending with `/api/auth/callback/twitter`. For example, `https://www.faucet.com/api/auth/callback/twitter`. | *None* |
| `TWITTER_CLIENT_SECRET` | Obtain Twitter OAuth2.0 client secret in [Twitter Developer Portal](https://developer.twitter.com/). | *None* |
| `GITHUB_CLIENT_ID` | Obtain GitHub OAuth2.0 client ID in [GitHub Developer settings](https://github.com/settings/developers/) | *None* |
| `GITHUB_CLIENT_SECRET` | Obtain GitHub OAuth2.0 client secret in [GitHub Developer settings](https://github.com/settings/developers/) | *None* |

### Local blockchain setup

1. First, set the local blockchain using instructions from [Substrate documentation](https://docs.substrate.io/quick-start/).
2. Run the local blockchain with `./target/release/node-template --dev`.
3. Obtain secret seed that is used as faucet's fund wallet by running ` ./target/release/node-template key inspect //Alice`.

### Environments

In order to avoid accidental sending of tokens, or other potential issues regarding account and network mismatches, there are 3 environments by default which need to be configured, test, development and production. 

To get them set up, copy the sample file `.env.sample` and configure the variables for each environment separately:

```bash
cp .env.sample .env
cp .env.sample .env.test
cp .env.sample .env.local
```

| Environment | Description |
| ------------- | ------------- |
| `.env` | Used for production environment. |
| `.env.test` | Used for the testing environment. |
| `.env.local` | Used for the development environment. |

## Demo

[Demo can be seen here](https://sybil-resistant-substrate-faucet.vercel.app/).
