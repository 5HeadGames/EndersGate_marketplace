"use client";
import { Button } from "@shared/components/common/button";
import { useBlockchain } from "@shared/context/useBlockchain";
import { useUser } from "@shared/context/useUser";
import { transferTokens } from "@shared/utils/transfer-tokens";
import { getAddresses } from "@shared/web3";
import React from "react";

const Test = () => {
  const { blockchain } = useBlockchain();
  const { usdc } = getAddresses(blockchain);
  const {
    user: { ethAddress, provider },
  } = useUser();
  console.log(usdc);
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4 bg-overlay sm:p-4 p-2 rounded-xl border border-transparent-color-gray-200 relative shadow-inner">
        <Button
          decoration="fillGreen"
          className={
            "w-auto px-6 py-2 flex justify-center items-center rounded-xl !font-bold"
          }
          onClick={() => {
            transferTokens({
              sourceChain: blockchain == "eth" ? "ethereum" : "matic",
              destinationChain: blockchain == "eth" ? "matic" : "ethereum",
              destinationAccount: "0xc2B8Abc5249397DB5d159b4E3c311c2fAf4091f2",
              tokenAddress: usdc,
              amount: "1",
              provider,
              ethAddress,
            });
          }}
        >
          Transfer!
        </Button>
      </div>
    </div>
  );
};

export default Test;
