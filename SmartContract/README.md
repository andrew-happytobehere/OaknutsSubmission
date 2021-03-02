# OakNuts Smart Contracts
![CI](https://github.com/oaknuts-solana/oaknuts-smart-contracts/workflows/CI/badge.svg?branch=main)
## Description

## How to contribute

### Visual Studio Code Setup [Optional]
Install [Visual Studio Code](https://code.visualstudio.com/) and two extensions:
- [Rust Extension](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust)
- [Crates Extension](https://marketplace.visualstudio.com/items?itemName=serayuzgur.crates)

### How to build
From the top of repository, run:

```
cargo build
```

If building for the Solana network, run:

```
cargo build-bpf
```

### How to test

To execute sanity/unit tests, run:

```
cargo test
```

## Publishing

### How to deploy a program
After building for the Solana network, you'll be given a message like this:

```
To deploy this program:
  $ solana program deploy [PATH TO REPO]/target/deploy/oaknuts_solana.so
```

with a different filepath at the end. Before we can deploy this, however, we need to ensure we have configured our solana cluster (if deploying on a local testnet), our key pair, and our SOL balance on that wallet to pay for deployment.

#### Starting up a local test net
Ensure you have [Solana cli installed](https://docs.solana.com/cli/install-solana-cli-tools). Then, run the following:

```
solana-test-validator
```

Leave this window open.

#### Generating a keypair
To create a keypair, run the following:

```
solana-keygen new
```

Save the public / private key somewhere. Note: When deploying to the mainnet it's very important that these keys are kept secret. This is what allows us to prove ownership of the program.

#### Funding our new wallet
Now that we've created a keypair in the previous step, we need to fund that wallet. We can request airdrops of tokens in the networks (except for mainnet) to be able to do this. Run the following command:

```
solana airdrop -u localhost 10 <public key from last step>
```

#### Deploying our program
Now that we have an account funded we can deploy the program to the local network using the following command:

```
solana program deploy -u localhost <filepath from cargo build-bpf output>
```

This will give back a programID. Keep this somewhere so you can use it later to refer to your program for upgrades.

## Generating documentation
[TBD]
