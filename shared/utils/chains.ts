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

const SKL: any = {
  name: "Skale Token",
  symbol: "sFUEL",
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

export const CHAINS: {
  [chainId: number]: any;
} = {
  // 1205: {
  //   urls: [`https://gsc-testnet.prod.findora.org:8545`],
  //   name: "Findora GSC Testnet",
  //   rpcUrls: ["https://gsc-testnet.prod.findora.org:8545"],

  //   nativeCurrency: FINDORA,
  //   blockExplorerUrls: ["https://gsc-testnet.evm.findorascan.io/"],
  //   blockExplorer: "https://gsc-testnet.evm.findorascan.io/",
  // },
  // 1204: {
  //   urls: ["https://gsc-mainnet.prod.findora.org:8545"],
  //   name: "Findora GSC Mainnet",
  //   rpcUrls: ["https://gsc-mainnet.prod.findora.org:8545"],

  //   nativeCurrency: FINDORA,
  //   blockExplorerUrls: ["https://gsc-mainnet.evm.findorascan.io/"],
  //   blockExplorer: "https://gsc-mainnet.evm.findorascan.io/",
  // },
  1351057110: {
    urls: [
      "https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix",
    ],
    name: "Inmutable X Testnet",
    rpcUrls: [
      "https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix",
    ],
    nativeCurrency: SKL,
    blockExplorerUrls: [
      "https://staging-fast-active-bellatrix.explorer.staging-v3.skalenodes.com",
    ],
    blockExplorer:
      "https://staging-fast-active-bellatrix.explorer.staging-v3.skalenodes.com",
    type: "mainnet",
  },
  1370526269: {
    urls: [
      "https://staging-v3.skalenodes.com/v1/staging-perfect-parallel-gacrux",
    ],
    name: "Skale Test Chain 1",
    rpcUrls: [
      "https://staging-v3.skalenodes.com/v1/staging-perfect-parallel-gacrux",
    ],
    nativeCurrency: IMX,
    blockExplorerUrls: [
      "https://staging-perfect-parallel-gacrux.explorer.staging-v3.skalenodes.com/",
    ],
    blockExplorer:
      "https://staging-perfect-parallel-gacrux.explorer.staging-v3.skalenodes.com/",
    type: "testnet",
  },
  13472: {
    urls: [" https://rpc.testnet.immutable.com"],
    name: "Inmutable X Testnet",
    rpcUrls: [" https://rpc.testnet.immutable.com"],
    nativeCurrency: IMX,
    blockExplorerUrls: ["https://explorer.testnet.immutable.com/"],
    blockExplorer: "https://explorer.testnet.immutable.com/",
    type: "testnet",
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
    type: "mainnet",
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
    type: "testnet",
  },
};

export const MAINNET_CHAIN_IDS = Object.keys(CHAINS)
  .map((key) => {
    return CHAINS[key].type == "mainnet" ? key : false;
  })
  .filter((chain) => {
    return chain;
  });
export const TESTNET_CHAIN_IDS = Object.keys(CHAINS)
  .map((key) => {
    return CHAINS[key].type == "testnet" ? key : false;
  })
  .filter((chain) => {
    return chain;
  });

export const CHAIN_IDS_BY_NAME: {
  [chain: string]: any;
} = {
  matic: process.env.NEXT_PUBLIC_ENV === "production" ? 137 : 80001,
  eth: process.env.NEXT_PUBLIC_ENV === "production" ? 1 : 11155111,
  imx: process.env.NEXT_PUBLIC_ENV === "production" ? 13472 : 13472,
  skl: process.env.NEXT_PUBLIC_ENV === "production" ? 1351057110 : 1370526269,
};

export const CHAIN_NAME_BY_ID: {
  [chain: string]: any;
} = {
  // 1204: "findora",
  // 1205: "findora",
  137: "matic",
  80001: "matic",
  1: "eth",
  11155111: "eth",
  13472: "imx",
  1351057110: "skl",
  1370526269: "skl",
};

export const blockchains = [
  {
    name: "ETHEREUM",
    value: "eth",
    image: "/images/eth.png",
  },
  {
    name: "MATIC",
    value: "matic",
    image: "/images/matic.png",
  },
  // {
  //   name: "FINDORA GSC",
  //   value: "findora",
  //   image: "/images/findora.png",
  // },
  {
    name: "INMUTABLE X",
    value: "imx",
    image: "/images/imx.png",
  },
  {
    name: "SKALE",
    value: "skl",
    image: "/images/skl.svg",
  },
];

export const URLS: { [chainId: number]: string[] } = Object.keys(
  CHAINS,
).reduce<{ [chainId: number]: string[] }>((accumulator, chainId) => {
  const validURLs: string[] = CHAINS[Number(chainId)].urls;

  if (validURLs.length) {
    accumulator[Number(chainId)] = validURLs;
  }

  return accumulator;
}, {});
