const publicRpc = {
  harmony: "https://api.harmony.one",
  polygon: "https://polygon-rpc.com/",
};

export const networkConfigs = {
  137: {
    name: "Polygon Mainnet",
    rpc: process.env["NEXT_PUBLIC_POLYGON_RPC"] || publicRpc["polygon"],
    blockExplorerURl: "https://polygonscan.com/",
    currencySymbol: "MATIC",
  },
  80001: {
    name: "Polygon Mumbai",
    rpc: process.env["NEXT_PUBLIC_POLYGON_RPC"] || publicRpc["polygon"],
    blockExplorerURl: "https://mumbai.polygonscan.com/",
    currencySymbol: "MATIC",
  },
  1204: {
    name: "Findora Game Specific Chain Mainnet",
    rpc: process.env["NEXT_PUBLIC_FINDORA_RPC"] || publicRpc["polygon"],
    blockExplorerURl: "https://gsc-testnet.evm.findorascan.io/",
    currencySymbol: "WFRA",
  },

  1205: {
    name: "Findora Game Specific Chain Testnet",
    rpc: process.env["NEXT_PUBLIC_FINDORA_RPC"] || publicRpc["polygon"],
    blockExplorerURl: "https://gsc-testnet.evm.findorascan.io/",
    currencySymbol: "WFRA",
  },
};

export const getNativeByChain = (chainId) =>
  networkConfigs[chainId]?.currencySymbol || "ETH";

export const getExplorer = (chainId) =>
  networkConfigs[chainId]?.blockExplorerUrl;
