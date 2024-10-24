"use client";
import { CHAIN_IDS_BY_NAME } from "@shared/utils/chains";
import { switchChain } from "@shared/web3";
import React, { createContext, useContext, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "./useUser";

export interface BlockchainContextData {
  blockchain: any;
  updateBlockchain: (arg1: any) => void;
}

const blockchainContext = createContext<BlockchainContextData>(
  {} as BlockchainContextData,
);

export const BlockchainContextProvider = ({ children }: any) => {
  const [blockchain, setBlockchain] = React.useState("matic");

  const {
    user: { providerName },
  } = useUser();

  const _updateBlockchain = useCallback(async (blockchain: any) => {
    try {
      if (providerName !== "magic") {
        const chainId = await (window as any)?.ethereum?.request({
          method: "eth_chainId",
        });
        if (chainId !== blockchain) {
          const changed = await switchChain(CHAIN_IDS_BY_NAME[blockchain]);
          if (!changed) {
            throw Error(
              "An error has occurred while switching chain, please try again.",
            );
          }
        }
      }
      setBlockchain(blockchain);
    } catch (err: any) {
      console.log(err.message);
      toast.error(err.message);
    }
  }, []);

  const updateBlockchain = useCallback(
    (blockchain: any) => {
      _updateBlockchain(blockchain);
    },
    [_updateBlockchain],
  );

  const value = useMemo(
    () => ({
      blockchain,
      updateBlockchain,
    }),
    [blockchain, updateBlockchain],
  );

  return (
    <blockchainContext.Provider value={value}>
      {children}
    </blockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(blockchainContext);
  if (context === undefined) {
    throw new Error("error");
  }
  return context;
};
