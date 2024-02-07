/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import { getAddresses, getContractCustom } from "@shared/web3";
import { PackOpeningComponent } from "@shared/components/PackOpening/PackOpeningComponent";
import { onGetAssets } from "@redux/actions";
import { useBlockchain } from "@shared/context/useBlockchain";
import { CHAIN_IDS_BY_NAME, CHAINS } from "@shared/utils/chains";
import { useUser } from "@shared/context/useUser";

const Packs = () => {
  const [contract, setContract] = useState<any>(null);
  const [NFTContract, setNFTContract] = useState<any>(null);
  const [history, setHistory] = useState([]);
  const [packs, setPacks] = useState<any>([]);
  const nfts = useSelector((state: any) => state.nfts);
  const dispatch = useDispatch();
  const { blockchain } = useBlockchain();

  const { endersGate, pack } = getAddresses(blockchain);
  const {
    user: { ethAddress, provider },
  } = useUser();

  React.useEffect(() => {
    if (NFTContract && provider) {
      updateHistory();
    }
  }, [NFTContract, provider]);

  const updateHistory = async () => {
    const web3 = new Web3(CHAINS[CHAIN_IDS_BY_NAME[blockchain]].urls[0]);
    const block = await web3.eth.getBlockNumber();
    const eventsTransfer = await NFTContract.getPastEvents("TransferSingle", {
      filter: {
        from: "0x0000000000000000000000000000000000000000",
        to: ethAddress,
      }, // Using an array means OR: e.g. 20 or 23
      fromBlock: block - 950,
      toBlock: "latest",
    });
    setHistory(
      eventsTransfer.map(({ transactionHash: txHash, returnValues }) => {
        return { txHash, id: returnValues.id };
      }),
    );
  };

  React.useEffect(() => {
    const packContract = getContractCustom("EndersPack", pack, provider);
    const endersGateContract = getContractCustom(
      "EndersGate",
      endersGate,
      provider,
    );
    setContract(packContract);
    setNFTContract(endersGateContract);
  }, []);

  const updateBalance = () => {
    dispatch(onGetAssets(ethAddress));
  };

  React.useEffect(() => {
    const arrayPacks: any = [];
    nfts.balancePacks.forEach((pack) => {
      for (let i = 0; i < pack.balance; i++) {
        arrayPacks.push({ id: pack.id });
      }
    });
    setPacks(arrayPacks);
  }, [nfts]);

  return (
    <div className="mt-14">
      <PackOpeningComponent
        updateBalance={updateBalance}
        arrayPacks={packs}
        packContract={contract}
        NFTContract={NFTContract}
        account={ethAddress}
        history={history}
        setHistory={setHistory}
      />
    </div>
  );
};

export default Packs;
