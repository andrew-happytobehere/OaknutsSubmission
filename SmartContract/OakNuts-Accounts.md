# OakNuts Contract Specification

## Purpose of Accounts
Using [Accounts](https://docs.solana.com/developing/programming-model/accounts), OakNuts aims to store the state of each user. This allows us to ensure the data is stored on-chain, but also allows data to be naturally removed or deprecated over time utilising the rent mechanism in-built to Solana accounts.

## Account Data Structure
Bytes (inclusive)
[0-31] Wallet Address
[32-72] Ethereum Address
[72-1000] Unallocated (can be maxed out to 10x10^6)

## Account instruction format
Bytes (inclusive)
[0] Opcode for Swap (1) or Account (2) instruction
[1] Opcode for instruction sub-type
[2-infinity] 