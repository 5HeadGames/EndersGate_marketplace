import {Connector} from "@web3-react/types";
import {
  ConnectionType,
  gnosisSafeConnection,
  metamaskConnection,
  coinbaseWalletConnection,
  walletConnectConnection,
} from "utils/connection";

export const getConnectionName = (connectionType: ConnectionType, isMetaMask?: boolean) => {
  switch (connectionType) {
    case ConnectionType.INJECTED:
      return isMetaMask ? "MetaMask" : "Injected";
    case ConnectionType.COINBASE_WALLET:
      return "Coinbase Wallet";
    case ConnectionType.WALLET_CONNECT:
      return "WalletConnect";
    case ConnectionType.NETWORK:
      return "Network";
    case ConnectionType.GNOSIS_SAFE:
      return "Gnosis Safe";
  }
};

const CONNECTIONS = [
  gnosisSafeConnection,
  metamaskConnection,
  coinbaseWalletConnection,
  walletConnectConnection,
];

export function getConnection(c: Connector | ConnectionType) {
  if (c instanceof Connector) {
    const connection = CONNECTIONS.find((connection) => connection.connector === c);
    if (!connection) {
      throw Error("unsupported connector");
    }
    return connection;
  } else {
    switch (c) {
      case ConnectionType.INJECTED:
        return metamaskConnection;
      case ConnectionType.COINBASE_WALLET:
        return coinbaseWalletConnection;
      case ConnectionType.WALLET_CONNECT:
        return walletConnectConnection;
      case ConnectionType.GNOSIS_SAFE:
        return gnosisSafeConnection;
      default:
        return metamaskConnection;
    }
  }
}

export const WALLETS = [
  {
    src: "/images/metamask.png",
    title: "Metamask",
    value: "metamask",
    connection: metamaskConnection,
  },
  {
    src: "/images/coinbase.png",
    title: "Coinbase",
    value: "coinbase",
    connection: coinbaseWalletConnection,
  },
  {
    src: "/images/walletconnect.png",
    title: "Wallet Connect",
    value: "walletconnect",
    connection: walletConnectConnection,
  },
];
