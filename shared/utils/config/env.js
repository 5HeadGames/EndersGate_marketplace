const getProviderRpcUrl = (network) => {
  let rpcUrl;

  switch (network) {
    case "ethereumMainnet":
      rpcUrl = process.env.ETHEREUM_MAINNET_RPC_URL;
      break;
    case "ethereumSepolia":
      rpcUrl = process.env.ETHEREUM_SEPOLIA_RPC_URL;
      break;
    // case "optimismMainnet":
    //   rpcUrl = process.env.OPTIMISM_MAINNET_RPC_URL;
    //   break;
    // case "optimismGoerli":
    //   rpcUrl = process.env.OPTIMISM_GOERLI_RPC_URL;
    //   break;
    // case "arbitrumTestnet":
    //   rpcUrl = process.env.ARBITRUM_TESTNET_RPC_URL;
    //   break;
    // case "avalancheMainnet":
    //   rpcUrl = process.env.AVALANCHE_MAINNET_RPC_URL;
    //   break;
    // case "avalancheFuji":
    //   rpcUrl = process.env.AVALANCHE_FUJI_RPC_URL;
    //   break;
    case "polygonMainnet":
      rpcUrl = process.env.POLYGON_MAINNET_RPC_URL;
      break;
    case "polygonMumbai":
      rpcUrl = process.env.POLYGON_MUMBAI_RPC_URL;
      break;
    // case "bnbTestnet":
    //   rpcUrl = process.env.BNB_TESTNET_RPC_URL;
    //   break;
    // case "baseGoerli":
    //   rpcUrl = process.env.BASE_GOERLI_RPC_URL;
    //   break;
    default:
      throw new Error("Unknown network: " + network);
  }

  if (!rpcUrl)
    throw new Error(
      `rpcUrl empty for network ${network} - check your environment variables`,
    );
  return rpcUrl;
};

module.exports = {
  getProviderRpcUrl,
};
