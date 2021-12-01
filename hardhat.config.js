require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
require('dotenv').config()

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks:{
    hardhat:{
      chainId: 1337,
    },
    mumbai:{
      url: "https://polygon-mumbai.g.alchemy.com/v2/2AJCzGpo5rVC7xYXqefOkBhACaEDX099",
      accounts:[`0x${process.env.private_key}`],
    }
  }
};
