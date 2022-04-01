# solidity-raffle

# Description
A raffle game where participants enter by sending ETH to the contract. Once it reaches the player limit, a random participant wins all ETH (minus the house fee, which can be changed by the contract owner). 

- Smart contract written in Solidity
- Local Ethereum blockchain using Ganache
- Truffle to compile and migrate the contract
- Frontend using Web3.js, React Truffle Box, and React


# Requirements
- [Ganache](https://trufflesuite.com/ganache/index.html)
- [Node.js](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)

# Installation
- Clone the repo
    - `git clone https://github.com/rzufil/solidity-raffle`
- Install Truffle globally
    - `npm install -g truffle`
- Install contract dependencies
    - `npm install`
- Open Ganache and create a local Ethereum blockchain
- Compile and migrate the contract
    - `truffle compile`
    - `truffle migrate`
- Install client dependencies
    - `cd client`
    - `npm install`
- Start frontend
    - `npm start`

# Tests
- To test the contract run the following command at the root folder:
    - `truffle test`

# Configuration
- Changing raffle parameters
    - Only the contract owner has access to the raffle configuration
    - The house fee, max players, and entry fee can be changed by the contract owner by accessing `/admin`
    - The contract owner can also withdraw the contract balance at `/admin`