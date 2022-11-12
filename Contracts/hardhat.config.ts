import { task } from "hardhat/config";

import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";

import { NetworkUserConfig } from "hardhat/types";

import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
dotenvConfig({ path: resolve(__dirname, "./.env") });

//import "hardhat-gas-reporter";
//import "@nomiclabs/hardhat-etherscan";

const chainIds = {
  ganache: 1337,
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
};

const MNEMONIC = process.env.MNEMONIC || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const ALCHEMY_KEY = process.env.ALCHEMY_KEY || "";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.getAddress());
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: any = {
  defaultNetwork: "hardhat",
  networks: {
    // ganache: {
    //   url: "https://localhost:8545",
    //   // fork: "https://speedy-nodes-nyc.moralis.io/bdd2a4b14a469f0e3a230d4d/avalanche/mainnet@8501674",
    //   gas: 2100000,
    //   gasPrice: 8000000000
    // } as any,
    hardhat: {
      // accounts: {
      //   mnemonic: MNEMONIC,
      // },
      gas: 2100000,
      gasPrice: 8000000000,
    },
    harmony: {
      url: `https://api.harmony.one`,
      accounts: [process.env.PRIVATE_KEY],
    },
    // harmony_test: {
    //   url: `https://api.s0.b.hmny.io`,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 100,
    // enabled: process.env.REPORT_GAS ? true : false,
  } as any,
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  } as any,
};

export default config;
