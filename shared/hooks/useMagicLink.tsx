import React, { useState } from "react";
import { Magic } from "magic-sdk";
import { ConnectExtension } from "@magic-ext/connect";
import Web3 from "web3";
import { useBlockchain } from "@shared/context/useBlockchain";
import { CHAINS, CHAIN_IDS_BY_NAME } from "@shared/components/chains";

const getMagicConfig = (networkId: any) => {
  const network = CHAINS[networkId];
  return {
    rpcUrl: network.urls[0],
    chainId: networkId,
  };
};

export default function useMagicLink(networkId: number = 137) {
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState<any>(null);
  const [web3, setWeb3] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [magic, setMagic] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<any>(false);

  const [user, setUser] = React.useState(null);

  const { blockchain } = useBlockchain();

  const getMagic = (blockchain: string) => {
    const key = process.env.NEXT_PUBLIC_MAGIC_KEY
      ? process.env.NEXT_PUBLIC_MAGIC_KEY
      : "";

    const magic: any = new Magic(key, {
      network: getMagicConfig(CHAIN_IDS_BY_NAME[blockchain]),
      locale: "en_US",
      extensions: [new ConnectExtension()],
    });

    return magic;
  };

  if (
    typeof window !== "undefined" &&
    magic == null &&
    process.env.NEXT_PUBLIC_MAGIC_KEY
  ) {
    // Client-side-only code
    const magic = getMagic(blockchain);
    setMagic(magic);
    setProvider(magic.rpcProvider);
    setWeb3(new Web3(magic.rpcProvider));
  }

  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      magic == null &&
      process.env.NEXT_PUBLIC_MAGIC_KEY
    ) {
      // Client-side-only code
      const magic = getMagic(blockchain);
      setMagic(magic);
      setProvider(magic.rpcProvider);
      setWeb3(new Web3(magic.rpcProvider));
    }
  }, [blockchain]);

  const showWallet = () => {
    const magic = getMagic(blockchain);
    magic.connect.showWallet().catch((e: any) => {
      console.log(e);
    });
  };

  const login = async (updateUser: any) => {
    setLoading(true);
    try {
      const magic = getMagic(blockchain);
      const web3 = new Web3(magic.rpcProvider);
      const publicAddress = (await web3.eth.getAccounts())[0];
      setAccount(publicAddress);
      setIsAuthenticated(true);
      updateUser({
        ethAddress: publicAddress,
        email: "",
        provider: provider,
        providerName: "magic",
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const logout = async (updateUser: any) => {
    setLoading(true);
    const magic = getMagic(blockchain);
    await magic.connect.disconnect().catch((e: any) => {
      console.log(e);
    });
    setIsAuthenticated(false);
    setAccount(null);
    updateUser({
      ethAddress: "",
      providerName: "",
      email: "",
      provider: undefined,
    });
    setLoading(false);
  };

  React.useEffect(() => {
    if (account != null) {
      setUser({
        get: (attr: string) => {
          return user[attr];
        },
        ethAddress: account,
        email: "",
        name: "",
        logged: true,
      });
    } else {
      setUser(null);
    }
  }, [account, isAuthenticated]);

  return {
    loading,
    login,
    account,
    magic,
    appKey: process.env.NEXT_PUBLIC_MAGIC_KEY,
    isInitialized: magic !== null,
    logout,
    isAuthenticated,
    user,
    showWallet,
    web3,
    isWeb3Enabled: web3 !== undefined,
    provider: provider,
  };
}
