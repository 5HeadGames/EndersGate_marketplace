import type { AddEthereumChainParameter } from "@web3-react/types";

const MATIC: any = {
  name: "Matic",
  symbol: "MATIC",
  decimals: 18,
};

const FINDORA: any = {
  name: "Wrapped Findora",
  symbol: "WFRA",
  decimals: 18,
};

interface BasicChainInformation {
  urls: string[];
  name: string;
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter["nativeCurrency"];
  blockExplorerUrls: AddEthereumChainParameter["blockExplorerUrls"];
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation,
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency;
}

export function getAddChainParameters(
  chainId: number,
): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId];
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    };
  } else {
    return chainId;
  }
}

export const MAINNET_CHAIN_IDS = [137, 1204];
export const TESTNET_CHAIN_IDS = [80001, 1205];

export const CHAINS: {
  [chainId: number]: any;
} = {
  1205: {
    urls: [`https://gsc-testnet.prod.findora.org:8545`],
    name: "Findora GSC Testnet",
    rpcUrls: ["https://gsc-testnet.prod.findora.org:8545"],

    nativeCurrency: FINDORA,
    blockExplorerUrls: ["https://gsc-testnet.evm.findorascan.io/"],
    blockExplorer: "https://gsc-testnet.evm.findorascan.io/",
  },
  1204: {
    urls: ["https://gsc-mainnet.prod.findora.org:8545"],
    name: "Findora GSC Mainnet",
    rpcUrls: ["https://gsc-mainnet.prod.findora.org:8545"],

    nativeCurrency: FINDORA,
    blockExplorerUrls: ["https://gsc-mainnet.evm.findorascan.io/"],
    blockExplorer: "https://gsc-mainnet.evm.findorascan.io/",
  },
  137: {
    urls: [
      process.env.NEXT_PUBLIC_POLYGON_PROVIDER || "",
      "https://polygon-rpc.com",
    ].filter((url) => url !== ""),
    rpcUrls: ["https://endpoints.omniatech.io/v1/matic/mumbai/public	"],

    name: "Polygon Mainnet",
    nativeCurrency: MATIC,
    blockExplorerUrls: ["https://polygonscan.com"],
    blockExplorer: "https://polygonscan.com",
  },
  80001: {
    urls: [
      process.env.NEXT_PUBLIC_POLYGON_PROVIDER || "",
      "https://rpc-mumbai.maticvigil.com",
    ].filter((url) => url !== ""),
    rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
    name: "Polygon Mumbai",
    nativeCurrency: MATIC,
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
    blockExplorer: "https://mumbai.polygonscan.com",
  },
};

export const CHAIN_IDS_BY_NAME: {
  [chain: string]: any;
} = {
  findora: process.env.NEXT_PUBLIC_ENV === "production" ? 1204 : 1205,
  matic: process.env.NEXT_PUBLIC_ENV === "production" ? 137 : 80001,
  ethereum: process.env.NEXT_PUBLIC_ENV === "production" ? 1 : 11155111,
};

export const CHAIN_NAME_BY_ID: {
  [chain: string]: any;
} = {
  1204: "findora",
  1205: "findora",
  137: "matic",
  80001: "matic",
  1: "ethereum",
  11155111: "ethereum",
};

export const URLS: { [chainId: number]: string[] } = Object.keys(
  CHAINS,
).reduce<{ [chainId: number]: string[] }>((accumulator, chainId) => {
  const validURLs: string[] = CHAINS[Number(chainId)].urls;

  if (validURLs.length) {
    accumulator[Number(chainId)] = validURLs;
  }

  return accumulator;
}, {});
