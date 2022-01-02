import {task} from "hardhat/config";

import {config as dotenvConfig} from "dotenv";
import {resolve} from "path";
dotenvConfig({path: resolve(__dirname, "./.env")});

import {NetworkUserConfig} from "hardhat/types";

import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";

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

function createTestnetConfig(network: keyof typeof chainIds): NetworkUserConfig {
  const url: string = "https://" + network + ".infura.io/v3/" + INFURA_API_KEY;
  return {
    accounts: {
      count: 10,
      initialIndex: 0,
      mnemonic: MNEMONIC,
      path: "m/44'/60'/0'/0",
    },
    chainId: chainIds[network],
    url,
  };
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: any = {
  defaultNetwork: "hardhat",
  networks: {
    ganache: {
      url: 'https://localhost:8545',
      fork: 'https://speedy-nodes-nyc.moralis.io/bdd2a4b14a469f0e3a230d4d/avalanche/mainnet@8501674'
    } as any,
    hardhat: {
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
    mainnet: createTestnetConfig("mainnet"),
    goerli: createTestnetConfig("goerli"),
    kovan: createTestnetConfig("kovan"),
    rinkeby: createTestnetConfig("rinkeby"),
    ropsten: createTestnetConfig("ropsten"),
    avax: {
      url: 'https://speedy-nodes-nyc.moralis.io/bdd2a4b14a469f0e3a230d4d/avalanche/mainnet',
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.11",
      },
    ],
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY as any,
  } as any,
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

