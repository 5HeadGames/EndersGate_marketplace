"use client";
import { AddFundsModal } from "@shared/components/common/addFunds";
import { useBlockchain } from "@shared/context/useBlockchain";
import { CHAIN_TRANSAK_BY_NAME } from "@shared/utils/chains";
import React from "react";

const Dashboard = () => {
  const { blockchain } = useBlockchain();
  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <AddFundsModal
        amount={40}
        token={"IMX"}
        network={CHAIN_TRANSAK_BY_NAME[blockchain]}
        wallet={"0x40f75fb842e9001390bb11E89D02991E838095A7"}
        balance={0}
        loading={false}
        onClick={() => {}}
        hide={() => {}}
      />
    </div>
  );
};

export default Dashboard;
