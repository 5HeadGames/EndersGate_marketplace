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
  name: "USDC",
  symbol: "USDC",
  decimals: 18,
};

const LINEA: any = {
  name: "LINEA",
  symbol: "LineaETH",
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
  // 503129905: {
  //   urls: ["https://staging-v3.skalenodes.com/v1/staging-faint-slimy-achird"],
  //   name: "Nebula Hub",
  //   rpcUrls: [
  //     "https://staging-v3.skalenodes.com/v1/staging-faint-slimy-achird",
  //   ],
  //   nativeCurrency: SKL,
  //   blockExplorerUrls: [
  //     "https://staging-faint-slimy-achird.explorer.staging-v3.skalenodes.com/",
  //   ],
  //   blockExplorer:
  //     "https://staging-faint-slimy-achird.explorer.staging-v3.skalenodes.com/",
  //   type: "both",
  // },
  // 13472: {
  //   urls: [" https://rpc.testnet.immutable.com"],
  //   name: "Inmutable X Testnet",
  //   rpcUrls: [" https://rpc.testnet.immutable.com"],
  //   nativeCurrency: IMX,
  //   blockExplorerUrls: ["https://explorer.testnet.immutable.com/"],
  //   blockExplorer: "https://explorer.testnet.immutable.com/",
  //   type: "testnet",
  // },

  59144: {
    urls: ["https://linea.blockpi.network/v1/rpc/public"],
    name: "Linea",
    rpcUrls: ["https://linea.blockpi.network/v1/rpc/public"],
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://lineascan.build/"],
    blockExplorer: "https://lineascan.build/",
    type: "mainnet",
  },

  59140: {
    urls: ["https://rpc.goerli.linea.build"],
    name: "Linea Goerli",
    rpcUrls: ["https://rpc.goerli.linea.build"],
    nativeCurrency: LINEA,
    blockExplorerUrls: ["https://explorer.goerli.linea.build/"],
    blockExplorer: "https://explorer.goerli.linea.build/",
    type: "testnet",
  },

  137: {
    urls: [
      process.env.NEXT_PUBLIC_POLYGON_PROVIDER || "",
      "https://polygon-rpc.com",
    ].filter((url) => url !== ""),
    rpcUrls: ["https://polygon-rpc.com"],

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
    return CHAINS[key].type == "mainnet" || CHAINS[key].type == "both"
      ? key
      : false;
  })
  .filter((chain) => {
    return chain;
  });
export const TESTNET_CHAIN_IDS = Object.keys(CHAINS)
  .map((key) => {
    return CHAINS[key].type == "testnet" || CHAINS[key].type == "both"
      ? key
      : false;
  })
  .filter((chain) => {
    return chain;
  });

export const CHAIN_IDS_BY_NAME: {
  [chain: string]: any;
} = {
  matic: process.env.NEXT_PUBLIC_ENV === "production" ? 137 : 80001,
  eth: process.env.NEXT_PUBLIC_ENV === "production" ? 1 : 11155111,
  imx: 13472,
  skl: 503129905,
  linea: process.env.NEXT_PUBLIC_ENV === "production" ? 59144 : 59140,
};

export const CHAIN_NAME_BY_ID: {
  [chain: string]: any;
} = {
  // 1204: "findora",
  // 1205: "findora",
  59140: "linea",
  59144: "linea",
  137: "matic",
  80001: "matic",
  1: "eth",
  11155111: "eth",
  13472: "imx",
  503129905: "skl",
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
  //   name: "LINEA",
  //   value: "linea",
  //   image: "/images/linea.png",
  // },
  // {
  //   name: "FINDORA GSC",
  //   value: "findora",
  //   image: "/images/findora.png",
  // },
  // {
  //   name: "INMUTABLE X",
  //   value: "imx",
  //   image: "/images/imx.png",
  // },
  {
    name: "NEBULA HUB",
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
