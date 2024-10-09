[![Build](https://github.com/pindaroso/solana-zk-starter/actions/workflows/build.yaml/badge.svg)](https://github.com/pindaroso/solana-zk-starter/actions/workflows/build.yaml)

# Solana ZK Starter

This project is a starter for building and deploying Solana [ZK](https://www.zkcompression.com/) compression apps using [Light Protocol](https://github.com/Lightprotocol/light-protocol) and [Helius Photon](https://github.com/helius-labs/photon).

**Requirements**

- [Docker v4.32.2](https://docs.docker.com/engine/install/)
- [Node v18.20.0](https://github.com/nvm-sh/nvm)
- [pnpm v9.0.0](https://pnpm.io/installation)
- [Solana CLI v1.18.22](https://docs.solanalabs.com/cli/install)
- [Solana Verify CLI](https://github.com/Ellipsis-Labs/solana-verifiable-build)
- [Rust v1.74.0](https://www.rust-lang.org/tools/install)
- [Light Protocol CLI v1.2.0](https://github.com/Lightprotocol/light-protocol/tree/main/cli#readme)
- [Photon Indexer v0.45.0](https://github.com/helius-labs/photon)

**Install dependencies**

```bash
pnpm install
```

**Run the app**

```bash
pnpm dev
```

**Run the validator**

```bash
pnpm validator
```

**Deploy**

```bash
pnpm deploy
```
