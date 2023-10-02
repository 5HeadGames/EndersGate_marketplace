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

const ETH: any = {
  name: "Ethereum",
  symbol: "ETH",
  decimals: 18,
};

const IMX: any = {
  name: "Inmutable X Token",
  symbol: "tIMX",
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
  13472: {
    urls: [" https://rpc.testnet.immutable.com"],
    name: "Inmutable X Testnet",
    rpcUrls: [" https://rpc.testnet.immutable.com"],
    nativeCurrency: IMX,
    blockExplorerUrls: ["https://explorer.testnet.immutable.com/"],
    blockExplorer: "https://explorer.testnet.immutable.com/",
  },
  137: {
    urls: [
      process.env.NEXT_PUBLIC_POLYGON_PROVIDER || "",
      "https://polygon-rpc.com",
    ].filter((url) => url !== ""),
    rpcUrls: ["https://endpoints.omniatech.io/v1/matic/mumbai/public"],

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

export const NATIVE_CURRENCY_BY_ID = {
  1204: FINDORA,
  1205: FINDORA,
  137: MATIC,
  80001: MATIC,
  1: ETH,
  11155111: ETH,
  13472: IMX,
};

export const CHAIN_IDS_BY_NAME: {
  [chain: string]: any;
} = {
  findora: process.env.NEXT_PUBLIC_ENV === "production" ? 1204 : 1205,
  matic: process.env.NEXT_PUBLIC_ENV === "production" ? 137 : 80001,
  eth: process.env.NEXT_PUBLIC_ENV === "production" ? 1 : 11155111,
  imx: process.env.NEXT_PUBLIC_ENV === "production" ? 13472 : 13472,
};

export const CHAIN_NAME_BY_ID: {
  [chain: string]: any;
} = {
  1204: "findora",
  1205: "findora",
  137: "matic",
  80001: "matic",
  1: "eth",
  11155111: "eth",
  13472: "imx",
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
