import "@nomicfoundation/hardhat-toolbox";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 1337
    },
    // Example for Sepolia testnet
    // sepolia: {
    //   url: "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    //   accounts: ["YOUR_PRIVATE_KEY"]
    // }
  }
};
