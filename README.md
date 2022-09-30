Sybil-resistant faucet is a generic browser-based faucet solution that can be used on any existing parachain (substrate-based chain, either pallets or ink! smart contracts).

## Getting Started

1. Configure environment variables. Read more in [Configuration](#configuration) section.
2. Then, run the development server:

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
| `DRIP_CAP` | How many tokens to send per each claim. | 0.025 |
| `DRIP_DELAY` | How often user's can request to drip tokens (in seconds). | 86400 seconds (1 day) |
| `REDIS_ENDPOINT` | Redis instance endpoint. |  |
| `NETWORK_PROVIDER_ENDPOINT` | Substrate or Ink! based node endpoint. |  |
| `NETWORK_DECIMALS` | Decimal places used for network tokens. |  |
| `FAUCET_MNEMONIC` | Mnemonic of faucet's wallet from which funds will be drawn. |  |
| `NEXTAUTH_URL` | Authentication endpoint. | http://localhost:3000 |
| `NEXTAUTH_SECRET` | Used to encrypt JWT tokens. | random_string |
| `TWITTER_CLIENT_ID` | Twitter client ID. |  |
| `TWITTER_CLIENT_SECRET` | Twitter client secret. |  |
| `GITHUB_CLIENT_ID` | GitHub client ID. |  |
| `GITHUB_CLIENT_SECRET` | GitHub client secret. |  |

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