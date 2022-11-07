import WalletModal from "@shared/components/WalletModal";
import { useWeb3React } from "@web3-react/core";
import React from "react";

export default function Home() {
  const { account } = useWeb3React();
  const [login, setLogin] = React.useState(false);

  return (
    <div className="h-screen flex items-center justify-center text-primary">
      {" "}
      <button
        className="p-4 bg-white text-primary rounded-md border border-primary"
        onClick={() => setLogin(true)}
      >
        {" "}
        Connect
      </button>
      <WalletModal
        showModal={!Boolean(account) && login}
        setShowModal={() => 1}
      />
    </div>
  );
}
