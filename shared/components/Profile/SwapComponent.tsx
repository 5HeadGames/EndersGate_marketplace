import { Button } from "@shared/components/common/button";

import React from "react";
import { SearchOutlined } from "@ant-design/icons";

import { useWeb3React } from "@web3-react/core";
import { XIcon } from "@heroicons/react/solid";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "@shared/hooks/modal";
import { getAddresses, getContractCustom } from "@shared/web3";
import Web3 from "web3";

const navItems = [
  { title: "Trading Cards", value: "Trading Cards" },
  { title: "Packs", value: "Packs" },
];

const SwapComponent = () => {
  const { account: user, provider } = useWeb3React();
  const { ethAddress } = useSelector((state: any) => state.layout.user);

  const dispatch = useDispatch();
  const { Modal, show, hide, isShow } = useModal();
  const { common_pack, rare_pack, epic_pack, legendary_pack } = getAddresses();

  const passPacks = [
    {
      name: "Gen 0 Common Pass",
      nameKey: "Common Pack",
      image: "/images/CommonPass.png",
      address: common_pack,
    },
    {
      name: "Gen 0 Rare Pass",
      nameKey: "Rare Pack",
      image: "/images/RarePass.png",
      address: rare_pack,
    },
    {
      name: "Gen 0 Epic Pass",
      nameKey: "Epic Pack",
      image: "/images/EpicPass.png",
      address: epic_pack,
    },
    {
      name: "Gen 0 Legendary Pass",
      nameKey: "Legendary Pack",
      image: "/images/LegendaryPass.png",
      address: legendary_pack,
    },
  ];

  const [balance, setBalance] = React.useState({
    "Common Pack": 0,
    "Rare Pack": 0,
    "Epic Pack": 0,
    "Legendary Pack": 0,
  });
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (user) {
      handleSetBalance();
    }
  }, [user]);

  const handleSetBalance = async () => {
    const balance = {
      "Common Pack": 0,
      "Rare Pack": 0,
      "Epic Pack": 0,
      "Legendary Pack": 0,
    };
    const web3 = new Web3(
      process.env["NEXT_PUBLIC_POLYGON_RPC"]
        ? process.env["NEXT_PUBLIC_POLYGON_RPC"]
        : "http://localhost:8585",
    );
    passPacks.forEach(async (item) => {
      const pack = await getContractCustom(
        "ERC721Seadrop",
        item.address,
        web3.currentProvider,
      );
      console.log(
        await pack.methods.balanceOf(user).call(),
        user,
        pack,
        "balance",
      );
      balance[item.nameKey] = await pack.methods.balanceOf(user).call();
    });

    setBalance(balance);
  };

  const exchangeAll = () => {
    // try{
    //  const isApprovedForAll = await endersgateInstance.methods
    //     .isApprovedForAll(user, marketplace)
    //     .call();
    //       await dispatch(
    //     onSellERC1155({
    //       address: endersGate,
    //       from: user,
    //       startingPrice: (sellNFTData.startingPrice * 10 ** 6).toString(),
    //       amount: sellNFTData.amount,
    //       tokenId: tokenId,
    //       tokens: tokensSelected,
    //       duration: sellNFTData.duration.toString(),
    //       provider: provider.provider,
    //       // user: user,
    //     }),}catch(){
    //     }
  };

  return (
    <div className="flex flex-col w-full 2xl:px-36 px-24">
      <Modal isShow={isShow} withoutX>
        <div className="flex flex-col items-center bg-secondary rounded-xl border border-overlay-border w-auto relative w-[500px]">
          <div className="flex items-center justify-center border-b border-overlay-border w-full py-4 px-4 relative">
            <h2 className="font-bold text-primary text-center text-3xl">
              Swap
            </h2>
            <XIcon
              onClick={() => hide()}
              className="absolute right-4 top-0 bottom-0 my-auto text-primary-disabled text-xl w-6 cursor-pointer"
            ></XIcon>
          </div>
          <div className="flex flex-col gap-4 px-4 w-full items-center justify-center pb-4 pt-2 border-b border-overlay-border">
            <h3 className="text-xl text-white text-left w-full font-bold Raleway">
              Swap your ERC721 NFTs for ERC1155
            </h3>
            <p className="text-sm text-primary-disabled text-justify">
              <span className="text-white"> Note:</span> You will need to
              complete two transactions in order to list your tokens on our
              platform. The first transaction is to grant us permission to list
              your tokens, and the second transaction is to actually list the
              tokens. If you have already granted us permission, you will only
              need to complete the second transaction.
            </p>
          </div>
          <div className="flex sm:flex-row flex-col gap-4 w-full justify-center items-center py-4">
            <Button
              className="px-2 py-1 border !border-green-button bg-gradient-to-b from-overlay to-[#233408] rounded-md"
              onClick={() => {
                exchangeAll();
                hide();
              }}
            >
              Confirm Swap
            </Button>
          </div>
        </div>
      </Modal>
      <div className="flex gap-4 items-center mb-4">
        <div className="border flex items-center text-lg justify-center border-overlay-border bg-overlay-2 rounded-xl w-full">
          <div className="text-white flex items-center w-full py-1 px-4 rounded-xl bg-overlay border-r border-overlay-border">
            <input
              type="text"
              className="text-white w-full bg-transparent focus:outline-none"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <div
              className="text-white cursor-pointer flex items-center"
              onClick={() => setSearch("")}
            >
              <XIcon color="#fff" width={"16px"} />
            </div>
          </div>
          <div className="text-white text-xl flex items-center justify-center px-2">
            <SearchOutlined />
          </div>
        </div>
      </div>
      <div className="flex md:flex-row flex-col md:items-end md:justify-start justify-center gap-4 mb-2 pl-4">
        <div className="text-primary-disabled font-bold Raleway">
          {Object.keys(balance)
            ?.map((item) => balance[item])
            ?.reduce((acc, num) => acc + num)}{" "}
          ERC721 Items
        </div>
        <Button
          className="px-2 py-1 border !border-green-button bg-gradient-to-b from-overlay to-[#233408] rounded-md"
          onClick={() => {
            show();
          }}
        >
          Swap All to ERC1155
        </Button>
      </div>
      <div className="flex items-center justify-center gap-4 min-h-[calc(75vh)] border border-overlay-border bg-overlay rounded-xl p-4 overflow-auto">
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 items-center justify-center gap-4">
          {passPacks.map((item) => {
            return (
              <div className="flex items-center flex-col md:w-96 sm:w-72 w-60">
                <img src={item.image} className="w-full" alt="" />
                <h2 className="text-white text-xl font-bold text-center Raleway mt-1">
                  {item.name}
                </h2>
                <p className="text-md text-primary-disabled Raleway">
                  QUANTITY: {balance[item.nameKey]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SwapComponent;
