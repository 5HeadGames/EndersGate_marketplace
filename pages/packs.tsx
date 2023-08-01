/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import { getAddresses, getContractCustom } from "@shared/web3";
import { PackOpeningComponent } from "@shared/components/PackOpening/PackOpeningComponent";
import { onGetAssets } from "@redux/actions";
import { useBlockchain } from "@shared/context/useBlockchain";

const Packs = () => {
  const [contract, setContract] = useState(null);
  const [NFTContract, setNFTContract] = useState(null);
  const [history, setHistory] = useState([]);
  const [packs, setPacks] = useState([]);
  const nfts = useSelector((state: any) => state.nfts);
  const dispatch = useDispatch();
  const { blockchain } = useBlockchain();

  const { endersGate, pack } = getAddresses(blockchain);

  const { ethAddress, provider, networkId } = useSelector(
    (state: any) => state.layout.user,
  );

  React.useEffect(() => {
    if (NFTContract && provider) {
      updateHistory();
    }
  }, [NFTContract, provider]);

  const updateHistory = async () => {
    const web3 = new Web3(
      networkId !== "137"
        ? "https://polygon-mumbai.g.alchemy.com/v2/HxxZ-aFZZPrlenpzbC_UdAMg-4tN4UzM"
        : "https://nd-031-365-435.p2pify.com/00d23c83da737df7693dceffb182e42c",
    );
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
    const arrayPacks = [];
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
