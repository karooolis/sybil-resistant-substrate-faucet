Sybil-resistant faucet is a generic browser-based faucet solution that can be used on any existing parachain (substrate-based chain, either pallets or ink! smart contracts).

## Getting Started

1. Configure environment variables that are needed for user authentication, faucet wallet, etc. Copy `.env.sample` file into `.env.local` and `.env.test`, and start setting up the environment variables in both of these. The rationale behind different environments setup can be found in [Environments](#environments) section. Each variable, along with its setup instructions, as well as default values, is described in [Configuration](#configuration) section.

2. Install the dependencies with:

```bash
npm install
# or
yarn install
```

3. (optional) For local development and testing you may also want to set up a local Substrate node. Find instructions on [local blockchain setup](#local-blockchain-setup).

4. Once all environment variables are ready, run the development server:

```bash
npm run dev
# or
yarn dev
```

**Note**: all environment variables need to be set correctly in order for the faucet to work 🚨

## Testing

Tests consist of unit & integration tests for frontend & backend, as well as E2E tests.

### Unit & integration testing

Unit & integration tests are written in Jest. Frontend tests are run with:

```bash
npm run test:frontend
# or
yarn test:frontend
```

Backend tests are run with:

```bash
npm run test:backend
# or
yarn test:backend
```

### End-to-end testing

End-to-end tests are written in Playwright, and can be run with:

```bash
npm run test:e2e
# or
yarn test:e2e
```

**Note**: in order for E2E tests to work, all environment variables need to be configured.

## Configuration

To make the faucet generic, many of its parts are configurable. Configuration settings are stored in `.env` files, one per each environment. Read more about environments and their setup in [environments](#environments) section.

| Variable                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Default                  |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `DRIP_CAP`                  | How many tokens to send per each claim.                                                                                                                                                                                                                                                                                                                                                                                                                     | `0.025`                  |
| `DRIP_DELAY`                | How often user's can request to drip tokens (in seconds).                                                                                                                                                                                                                                                                                                                                                                                                   | `86400 seconds (1 day)`  |
| `REDIS_ENDPOINT`            | Redis instance endpoint. It's easiest to setup Redis instance at [Redis Cloud](https://redis.com/try-free/), or you may run a local instance. In `test` environment, and when no Redis endpoint is setup, [a mocked Redis instance](https://www.npmjs.com/package/ioredis-mock) is used.                                                                                                                                                                    | _None (mocked instance)_ |
| `NETWORK_PROVIDER_ENDPOINT` | Substrate or Ink! based blockchain endpoint. Optionally, for testing purposes, read more on [local blockchain setup](#local-blockchain-setup).                                                                                                                                                                                                                                                                                                              | `ws://127.0.0.1:9944`    |
| `FAUCET_SECRET`             | Mnemonic or secret seed of faucet's wallet from which funds will be drawn. Optionally, for testing purposes, read more on [local blockchain setup](#local-blockchain-setup).                                                                                                                                                                                                                                                                                | `0xe5be9a509...`         |
| `NETWORK_DECIMALS`          | Decimal places used for network tokens.                                                                                                                                                                                                                                                                                                                                                                                                                     | `12`                     |
| `NEXTAUTH_URL`              | Authentication endpoint. Must be set to the canonical URL of your site. Read more on [NextAuth.js documentation](https://next-auth.js.org/configuration/options#nextauth_url).                                                                                                                                                                                                                                                                              | `http://127.0.0.1:3000`  |
| `NEXTAUTH_SECRET`           | Used to encrypt the JWT token. Read more on [NextAuth.js documentation](https://next-auth.js.org/configuration/options#nextauth_secret).                                                                                                                                                                                                                                                                                                                    | `set_random_string`      |
| `TWITTER_API_KEY`           | Obtain Twitter OAuth1.0 API key in [Twitter Developer Portal](https://developer.twitter.com/). Read [official Twitter instructions for more details](https://developer.twitter.com/en/docs/authentication/oauth-1-0a/api-key-and-secret). **Note**, while setting callback URL, make sure it is set to the canonical URL of your site, ending with `/api/auth/callback/twitter`. For example, `https://www.faucet.com/api/auth/callback/twitter`.           | _Demo API key_           |
| `TWITTER_API_SECRET`        | Obtain Twitter 0Auth1.0 API secret in [Twitter Developer Portal](https://developer.twitter.com/). Read [official Twitter instructions for more details](https://developer.twitter.com/en/docs/authentication/oauth-1-0a/api-key-and-secret).                                                                                                                                                                                                                | _Demo API secret_        |
| `GITHUB_CLIENT_ID`          | Obtain GitHub OAuth2.0 client ID in [GitHub Developer settings](https://github.com/settings/developers/). Read [official GitHub instructions for more details](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app). **Note**, while setting callback URL, make sure it is set to the canonical URL of your site, ending with `/api/auth/callback/github`. For example, `https://www.faucet.com/api/auth/callback/github`. | _Demo client ID_         |
| `GITHUB_CLIENT_SECRET`      | Obtain GitHub OAuth2.0 client secret in [GitHub Developer settings](https://github.com/settings/developers/). Read [official GitHub instructions for more details](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app).                                                                                                                                                                                                   | _Demo client secret_     |

### Local blockchain setup

1. First, set up the local blockchain using instructions from [Substrate documentation](https://docs.substrate.io/quick-start/).
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

| Environment  | Description                           |
| ------------ | ------------------------------------- |
| `.env`       | Used for production environment.      |
| `.env.test`  | Used for the testing environment.     |
| `.env.local` | Used for the development environment. |

## Demo

[Demo can be seen here](https://sybil-resistant-substrate-faucet.vercel.app/).
