import {ReactNode, useMemo} from "react";
import {Web3ReactHooks, Web3ReactProvider} from "@web3-react/core";
import {Connector} from "@web3-react/types";

import {Connection, ConnectionType} from "utils/connection";
import {getConnectionName, getConnection} from "utils/connection/utils";
import {useUser} from "@shared/context/useUser";

const SELECTABLE_WALLETS = [
  ConnectionType.INJECTED,
  ConnectionType.COINBASE_WALLET,
  ConnectionType.WALLET_CONNECT,
];

const getConnectionOrder = (selectedWallet: ConnectionType) => {
  const connectionTypes: ConnectionType[] = [];

  // Always attempt to use to Gnosis Safe first, as we can't know if we're in a SafeContext.
  connectionTypes.push(ConnectionType.GNOSIS_SAFE);

  // Add the `selectedWallet` to the top so it's prioritized, then add the other selectable wallets.
  if (selectedWallet) {
    connectionTypes.push(selectedWallet);
  }
  connectionTypes.push(
    ...SELECTABLE_WALLETS.filter((wallet) => wallet !== selectedWallet),
  );

  // Add network connection last as it should be the fallback.
  connectionTypes.push(ConnectionType.NETWORK);

  const value = connectionTypes.map(getConnection);
  return value;
};

export default function Web3Provider({children}: {children: ReactNode}) {
  const {
    user: {wallet},
  } = useUser();
  const connections = getConnectionOrder(wallet);
  const connectors: [Connector, Web3ReactHooks][] = connections.map(
    ({hooks, connector}: any) => [connector, hooks],
  );

  const key = useMemo(
    () =>
      connections
        .map(({type}: Connection) => getConnectionName(type))
        .join("-"),
    [connections],
  );

  return (
    <Web3ReactProvider connectors={connectors as any} key={key}>
      {children}
    </Web3ReactProvider>
  );
}
