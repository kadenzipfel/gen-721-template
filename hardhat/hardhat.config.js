require('dotenv').config()
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-etherscan"

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
