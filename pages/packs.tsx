import React, { useState } from "react";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { getAddresses, getContractCustom } from "@shared/web3";
import { PackOpeningComponent } from "@shared/components/PackOpening/PackOpeningComponent";

const Packs = () => {
  const [contract, setContract] = useState(null);
  const [NFTContract, setNFTContract] = useState(null);
  const [packs, setPacks] = useState([]);
  const [history, setHistory] = useState([]);

  const { endersGate, pack } = getAddresses();

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

  React.useEffect(() => {
    if (ethAddress && contract) {
      updateBalance();
    }
  }, [contract]);

  const updateBalance = async () => {
    const balanceOf = await contract.methods
      .balanceOfBatch(
        [ethAddress, ethAddress, ethAddress, ethAddress],
        [0, 1, 2, 3],
      )
      .call();
    console.log(balanceOf, pack, contract);
    const arrayPacks = [];
    for (let i = 0; i < balanceOf[0]; i++) {
      arrayPacks.push({ id: 0 });
    }
    for (let i = 0; i < balanceOf[1]; i++) {
      arrayPacks.push({ id: 1 });
    }
    for (let i = 0; i < balanceOf[2]; i++) {
      arrayPacks.push({ id: 2 });
    }
    for (let i = 0; i < balanceOf[3]; i++) {
      arrayPacks.push({ id: 3 });
    }
    setPacks(arrayPacks);
  };

  return (
    <>
      <PackOpeningComponent
        updateBalance={updateBalance}
        arrayPacks={packs}
        packContract={contract}
        NFTContract={NFTContract}
        account={ethAddress}
        history={history}
        setHistory={setHistory}
      />
    </>
  );
};

export default Packs;
