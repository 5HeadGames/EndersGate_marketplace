const publicRpc = {
  harmony: "https://api.harmony.one",
  polygon: "https://polygon-rpc.com/",
};

export const networkConfigs: any = {
  1666600000: {
    name: "Harmony Mainnet",
    rpc:
      "https://nd-992-293-249.p2pify.com/488f6285b313186d031e301d34201fbf" ||
      publicRpc["harmony"],
    blockExplorerUrl: "https://explorer.harmony.one/",
    currencySymbol: "ONE",
  },
  1666700000: {
    name: "Harmony Mainnet",
    rpc:
      "https://nd-992-293-249.p2pify.com/488f6285b313186d031e301d34201fbf" ||
      publicRpc["harmony"],
    blockExplorerUrl: "https://explorer.harmony.one/",
    currencySymbol: "ONE",
  },
  137: {
    name: "Polygon Mainnet",
    rpc:
      "https://nd-031-365-435.p2pify.com/00d23c83da737df7693dceffb182e42c" ||
      publicRpc["polygon"],
    blockExplorerURl: "https://polygonscan.com/",
    currencySymbol: "MATIC",
  },
  80001: {
    name: "Polygon Testnet",
    rpc:
      "https://polygon-mumbai.g.alchemy.com/v2/Hwke9vGNdDbeQFI0s6-NRLNdGh34Phvb" ||
      publicRpc["polygon"],
    blockExplorerURl: "https://rpc-mumbai.maticvigil.com",
    currencySymbol: "MATIC",
  },
};

export const getNativeByChain = (chainId: any) =>
  networkConfigs[chainId]?.currencySymbol || "ETH";

export const getExplorer = (chainId: any) =>
  networkConfigs[chainId]?.blockExplorerUrl;
