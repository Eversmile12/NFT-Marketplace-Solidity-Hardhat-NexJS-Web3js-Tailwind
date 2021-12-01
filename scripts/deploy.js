
const hre = require("hardhat");

async function main() {

  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketPlace = await NFTMarketplace.deploy();

  await nftMarketPlace.deployed();

  const NFT = await hre.ethers.getContractFactory('NFT');
  const nft = await NFT.deploy(nftMarketPlace.address);

  await nft.deployed();

  console.log(`NFT deployed on address: ${nft.address}`);
  console.log(`NFTMarketplace deplyed on address ${nftMarketPlace.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
