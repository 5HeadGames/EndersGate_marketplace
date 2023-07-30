const publicRpc = {
  harmony: "https://api.harmony.one",
  polygon: "https://polygon-rpc.com/",
};

export const networkConfigs = {
  1666600000: {
    name: "Harmony Mainnet",
    rpc: process.env["NEXT_PUBLIC_HARMONY_RPC"] || publicRpc["harmony"],
    blockExplorerUrl: "https://explorer.harmony.one/",
    currencySymbol: "ONE",
  },
  1666700000: {
    name: "Harmony Mainnet",
    rpc: process.env["NEXT_PUBLIC_HARMONY_RPC"] || publicRpc["harmony"],
    blockExplorerUrl: "https://explorer.harmony.one/",
    currencySymbol: "ONE",
  },
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

  1205: {
    name: "Findora Game Specific Chain Testnet",
    rpc: process.env["NEXT_PUBLIC_POLYGON_RPC"] || publicRpc["polygon"],
    blockExplorerURl: "https://gsc-testnet.evm.findorascan.io/",
    currencySymbol: "TRPG",
  },
  1206: {
    name: "Polygon Mumbai",
    rpc: process.env["NEXT_PUBLIC_POLYGON_RPC"] || publicRpc["polygon"],
    blockExplorerURl: "https://mumbai.polygonscan.com/",
    currencySymbol: "TRPG",
  },
};

export const getNativeByChain = (chainId) =>
  networkConfigs[chainId]?.currencySymbol || "ETH";

export const getExplorer = (chainId) =>
  networkConfigs[chainId]?.blockExplorerUrl;
