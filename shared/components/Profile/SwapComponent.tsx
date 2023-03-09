import { Button } from "@shared/components/common/button";

import React from "react";
import {
  ArrowRightOutlined,
  CheckOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { useWeb3React } from "@web3-react/core";
import { XIcon } from "@heroicons/react/solid";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "@shared/hooks/modal";
import { getAddresses, getContractCustom } from "@shared/web3";
import Web3 from "web3";
import {
  onApproveERC1155,
  onExchangeERC721to1155,
  onGetAssets,
} from "@redux/actions";
import { useToasts } from "react-toast-notifications";
import { Icons } from "@shared/const/Icons";

const navItems = [
  { title: "Trading Cards", value: "Trading Cards" },
  { title: "Packs", value: "Packs" },
];

const SwapComponent = () => {
  const { account: user, provider } = useWeb3React();

  const dispatch = useDispatch();
  const { Modal, show, hide, isShow } = useModal();
  const { common_pack, rare_pack, epic_pack, legendary_pack, exchange } =
    getAddresses();

  const { addToast } = useToasts();

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

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

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

    for (let i = 0; i < passPacks.length; i++) {
      const item = passPacks[i];
      const pack = await getContractCustom(
        "ERC721Seadrop",
        item.address,
        web3.currentProvider,
      );

      const balancePass = await pack.methods.balanceOf(user).call();
      balance[item.nameKey] = balancePass;
    }
    setBalance(balance);
  };

  const exchangeAll = async () => {
    setLoading(true);
    try {
      const packsToExchange = passPacks.filter(
        (item) => balance[item.nameKey] > 0,
      );

      for (let i = 0; i < packsToExchange.length; i++) {
        const item = packsToExchange[i];
        const pack = await getContractCustom(
          "ERC721Seadrop",
          item.address,
          provider.provider,
        );
        const isApproved = await pack.methods
          .isApprovedForAll(user, exchange)
          .call();
        if (isApproved == false) {
          const res: any = await dispatch(
            onApproveERC1155({
              from: user,
              pack: item.address,
              provider: provider.provider,
            }),
          );
          if (res?.payload?.err) {
            throw new Error(res?.payload.err.message);
          }
        }
      }

      const res: any = await dispatch(
        onExchangeERC721to1155({
          from: user,
          nfts: passPacks
            .filter((item) => balance[item.nameKey] > 0)
            .map((item) => item.address),
          provider: provider.provider,
        }),
      );
      console.log(res?.payload.err, "res");
      if (res?.payload?.err) {
        throw new Error(res?.payload.err.message);
      }

      setSuccess(true);
      dispatch(onGetAssets(user));
      addToast("Your NFTs have been exchanged succesfully!", {
        appearance: "success",
      });
      handleSetBalance();
      setTimeout(() => {
        hide();
        setLoading(false);
        setSuccess(false);
      }, 1500);
    } catch (error) {
      console.log(error);
      addToast("Ups! Error exchanging your tokens, please try again", {
        appearance: "error",
      });
      hide();
      setLoading(false);
      setSuccess(false);
    }
  };

  return (
    <div className="flex flex-col w-full 2xl:px-36 px-24">
      <Modal isShow={isShow} withoutX>
        <div className="flex flex-col items-center bg-secondary rounded-xl border border-overlay-border w-full relative md:max-w-[500px] md:min-w-[500px] max-w-[350px] min-w-[350px]">
          <div className="flex items-center justify-center border-b border-overlay-border w-full py-4 px-4 relative">
            <h2 className="font-bold text-primary text-center text-3xl">
              Swap
            </h2>
            {!loading && (
              <XIcon
                onClick={() => hide()}
                className="absolute right-4 top-0 bottom-0 my-auto text-primary-disabled text-xl w-6 cursor-pointer"
              ></XIcon>
            )}
          </div>
          <div className="flex flex-col gap-4 px-4 w-full items-center justify-center pb-4 pt-2 ">
            <h3 className="text-xl text-white text-left w-full font-bold Raleway">
              Swap your ERC721 NFTs for ERC1155
            </h3>
            <p className="text-sm text-primary-disabled text-justify">
              <span className="text-white"> Note:</span> You will need to
              complete{" "}
              {Object.keys(balance)
                ?.map((item) => balance[item])
                ?.filter((item) => item > 0).length + 1}{" "}
              transactions in order to list your tokens on our platform. The
              first transaction is to grant us permission to list your tokens,
              and the second transaction is to actually list the tokens. If you
              have already granted us permission, you will only need to complete
              the second transaction.
            </p>
          </div>

          <div className="flex gap-2 items-center justify-center py-2 border-y border-overlay-border relative">
            {loading && (
              <div className="flex flex-col items-center justify-center absolute top-0 bottom-0 left-0 right-0 m-auto w-full bg-[#00000088]">
                <div className="flex flex-col  items-center justify-center h-auto bg-overlay border border-overlay-border p-4 rounded-xl">
                  <h2 className="text-white text-xl text-center font-bold ">
                    Swap {success ? "completed" : "in progress..."}
                  </h2>
                  <div className="w-full flex items-center justify-center py-2">
                    {!success ? (
                      <LoadingOutlined className="text-4xl text-white" />
                    ) : (
                      <CheckOutlined className="text-4xl text-green-button" />
                    )}
                  </div>
                </div>
              </div>
            )}
            <img src="/images/CommonPass.png" className="w-1/3 flex" alt="" />
            <ArrowRightOutlined className="text-xl text-white" />
            <img src="/images/0.png" className="w-1/3 flex" alt="" />
          </div>
          <div className="flex sm:flex-row flex-col gap-4 w-full justify-center items-center py-4">
            <Button
              className="px-2 py-1 border !border-green-button bg-gradient-to-b from-overlay to-[#233408] rounded-md"
              onClick={() => {
                exchangeAll();
              }}
              disabled={loading}
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
            ?.map((item) => {
              return parseInt(balance[item]);
            })
            ?.reduce((acc, num) => {
              return acc + num;
            })}{" "}
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
        {Object.keys(balance)
          ?.map((item) => balance[item])
          ?.reduce((acc, num) => parseInt(acc) + parseInt(num)) > 0 ? (
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
        ) : (
          <div className="flex flex-col gap-2 h-full w-full items-center justify-center">
            <img src={Icons.logoCard} className="w-20" alt="" />
            <h2 className="text-xl text-primary-disabled text-center">
              You don't have any Pass NFT
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapComponent;
