import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { GnosisSafe } from "@web3-react/gnosis-safe";
import { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { WalletConnect } from "@web3-react/walletconnect";
import { getName } from "../utils";
import { Accounts } from "./Accounts";
import { Chain } from "./Chain";
import { ConnectWithSelect } from "./ConnectWithSelect";
import { Status } from "./Status";

interface Props {
  connector: any;
  chainId: ReturnType<any>;
  isActivating: ReturnType<any>;
  isActive: ReturnType<any>;
  error: Error | undefined;
  setError: (error: Error | undefined) => void;
  ENSNames: ReturnType<any>;
  provider?: ReturnType<any>;
  accounts?: string[];
}

export function Card({
  connector,
  chainId,
  isActivating,
  isActive,
  error,
  setError,
  ENSNames,
  accounts,
  provider,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "20rem",
        padding: "1rem",
        margin: "1rem",
        overflow: "auto",
        border: "1px solid",
        borderRadius: "1rem",
      }}
    >
      <b>{getName(connector)}</b>
      <div style={{ marginBottom: "1rem" }}>
        <Status isActivating={isActivating} isActive={isActive} error={error} />
      </div>
      <Chain chainId={chainId} />
      <div style={{ marginBottom: "1rem" }}>
        <Accounts accounts={accounts} provider={provider} ENSNames={ENSNames} />
      </div>
      <ConnectWithSelect
        connector={connector}
        chainId={chainId}
        isActivating={isActivating}
        isActive={isActive}
        error={error}
        setError={setError}
      />
    </div>
  );
}
