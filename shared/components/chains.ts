// import type { AddEthereumChainParameter } from "@web3-react/types";

// const ETH: AddEthereumChainParameter["nativeCurrency"] = {
//   name: "Ether",
//   symbol: "ETH",
//   decimals: 18,
// };

const MATIC: any = {
  name: "Matic",
  symbol: "MATIC",
  decimals: 18,
};

// const CELO: AddEthereumChainParameter["nativeCurrency"] = {
//   name: "Celo",
//   symbol: "CELO",
//   decimals: 18,
// };

// const ONE: AddEthereumChainParameter["nativeCurrency"] = {
//   name: "Harmony One",
//   symbol: "ONE",
//   decimals: 18,
// };

// // interface BasicChainInformation {
//   urls: string[];
//   name: string;
// }

// interface ExtendedChainInformation extends BasicChainInformation {
//   nativeCurrency: AddEthereumChainParameter["nativeCurrency"];
//   blockExplorerUrls: AddEthereumChainParameter["blockExplorerUrls"];
//   blockExplorer: string;
// }

// function isExtendedChainInformation(
//   chainInformation: BasicChainInformation | ExtendedChainInformation,
// ): chainInformation is ExtendedChainInformation {
//   return !!(chainInformation as ExtendedChainInformation).nativeCurrency;
// }

// export function getAddChainParameters(
//   chainId: number,
// ): AddEthereumChainParameter | number {
//   const chainInformation = CHAINS[chainId];
//   if (isExtendedChainInformation(chainInformation)) {
//     return {
//       chainId,
//       chainName: chainInformation.name,
//       nativeCurrency: chainInformation.nativeCurrency,
//       rpcUrls: chainInformation.urls,
//       blockExplorerUrls: chainInformation.blockExplorerUrls,
//     };
//   } else {
//     return chainId;
//   }
// }

export const CHAINS: {
  [chainId: number]: any;
} = {
  // Polygon
  137: {
    urls: [
      process.env.infuraKey
        ? `https://polygon-mainnet.infura.io/v3/${process.env.infuraKey}`
        : "",
      "https://polygon-rpc.com",
    ].filter((url) => url !== ""),
    name: "Polygon Mainnet",
    nativeCurrency: MATIC,
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
    blockExplorer: "https://polygonscan.com",
  },
  80001: {
    urls: [
      process.env.infuraKey
        ? `https://polygon-mumbai.infura.io/v3/${process.env.infuraKey}`
        : "",
    ].filter((url) => url !== ""),
    name: "Polygon Mumbai",
    nativeCurrency: MATIC,
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
    blockExplorer: "https://mumbai.polygonscan.com",
  },
  // Celo
};

// export const URLS: { [chainId: number]: string[] } = Object.keys(
//   CHAINS,
// ).reduce<{ [chainId: number]: string[] }>((accumulator, chainId) => {
//   const validURLs: string[] = CHAINS[Number(chainId)].urls;

//   if (validURLs.length) {
//     accumulator[Number(chainId)] = validURLs;
//   }

//   return accumulator;
// }, {});
