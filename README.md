# NFT Marketplace Tutorial

This repository is related to the [upcoming] tutorial. It contains the boilerplates code for a functioning Ethereum NFT marketplace.

## Prerequisites
- Metamask

## Installation

Install the node packages:

```bash
yarn install
```

Compile the Smart Contracts:
```bash
npx hardhat compile
```

You have two ways to interact with the NFT Marketplace:
- Locally using Hardhat
- Deploying the contracts on Polygon Mumbai-testnet

## Deploying the NFTMarketplace locally

Open your terminal and run:
```bash
npx hardhat node
```

This will start a local Ethereum blockchain node, log 19 wallets and their private keys.

Now in a new terminal window run:

```bash
npx hardhat run ./scripts/deploy.js --network localhost
```
This will deploy the contracts on the local ethereum node and print out their addresses (see: change contracts address section)

## Deploying the NFTMarketplace on Polygon Mumbai
As is, the contracts contained in the repository, are already deployed on Polygon Mumbai-testnet. 

If you want to work with brand new contracts, though, you'll need to:
1. Navigate to hardhat.config.js file in the root folder and substitute the private key, with your wallet's private key.

![image](https://user-images.githubusercontent.com/72762629/144294242-be8c53d2-c927-427a-8a14-ca4e90e1641e.png)

2. Get some test MATIC from an online faucet such as [this one](https://faucet.polygon.technology/)

Once you'll have both, run the following code in your terminal:
```bash
npx hardhat run ./scripts/deploy.js --network mumbai
```
This will log the address of the newly deployed contracts.

Refer to the next section to learn how to change the contracts adress the front-end will interact with.


### Change The NFT Marketplace Contracts Adresses
Navigate to /pages/utils/options.js and substitute the contracts addresses with new ones.

![image](https://user-images.githubusercontent.com/72762629/144292830-055a3205-9670-45b1-9b98-71f2ec940743.png)



### Disclaimer

All the work contained in this repository is provided ​“AS IS”. Developer makes no other warranties, express or implied, and hereby disclaims all implied warranties, including any warranty of merchantability and warranty of fitness for a particular purpose. The code should not be used in a production environment.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
