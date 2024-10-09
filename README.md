[![Build](https://github.com/pindaroso/solana-zk-starter/actions/workflows/build-app.yaml/badge.svg)](https://github.com/pindaroso/solana-zk-starter/actions/workflows/build-app.yaml)

# Solana ZK Starter

This project is a starter for building and deploying Solana [ZK](https://www.zkcompression.com/) compression apps using [Light Protocol](https://github.com/Lightprotocol/light-protocol) and [Helius Photon](https://github.com/helius-labs/photon).

**Requirements**

- [Docker v4.32.2](https://docs.docker.com/engine/install/)
- [Node v18.20.0](https://github.com/nvm-sh/nvm)
- [pnpm v7.0.0](https://pnpm.io/installation)
- [Solana CLI v1.18.22](https://docs.solanalabs.com/cli/install)
- [Anchor CLI v0.30.1](https://github.com/project-serum/anchor/releases/tag/v0.30.1)
- [Solana Verify CLI v0.2.11](https://github.com/Ellipsis-Labs/solana-verifiable-build)
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
