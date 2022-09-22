Sybil-resistant faucet is a generic browser-based faucet solution that can be used on any existing parachain (substrate-based chain, either pallets or ink! smart contracts).

## Getting Started

In order to run the faucet, you may first configure all the environment variables.

Then, run the development server:

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

To make the faucet generic, it stores all its configuration settings in `.env` file.

- `DRIP_CAP` - how many tokens to send per drip.
- `DRIP_DELAY` - how often user's can request to drip tokens (in seconds).
- `REDIS_ENDPOINT` - Redis instance endpoint.
- `NETWORK_PROVIDER_ENDPOINT` - Substrate node endpoint.
- `NETWORK_DECIMALS` - decimal places used for network tokens.
- `FAUCET_MNEMONIC` - mnemonic of faucet's wallet.
- `NEXTAUTH_ENDPOINT` - authentication endpoint.
- `NEXTAUTH_SECRET` - used to encrypt JWT tokens.
- `TWITTER_CLIENT_ID` - Twitter client ID.
- `TWITTER_CLIENT_SECRET` - Twitter client secret.
- `GITHUB_CLIENT_ID` - GitHub client ID.
- `GITHUB_CLIENT_SECRET` - GitHub client secret.

### Environments

While you may use a single `.env` file, it is preferable to set up separate environment files in order to avoid accidental sending of tokens, or other potential issues regarding account and network mismatches.

- `.env.test` - use for testing environment.
- `.env.local` - use for development environment.
- `.env` - use for production environment.
