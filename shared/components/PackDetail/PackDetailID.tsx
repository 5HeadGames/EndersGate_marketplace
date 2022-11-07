import React from "react";
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Web3 from "web3";

import { useAppDispatch, useAppSelector } from "redux/store";
import { onSellERC1155, onLoadSales, onGetAssets } from "@redux/actions";
import { Button } from "../common/button/button";
import { Icons } from "@shared/const/Icons";
import { getAddresses, getContractCustom } from "@shared/web3";
import { Typography } from "../common/typography";
import packs from "../../packs.json";
import { useModal } from "@shared/hooks/modal";
import { approveERC1155 } from "@shared/web3";
import { Images } from "@shared/const/Images";
import { convertArrayCards } from "../common/convertCards";
import Styles from "../NFTDetail/styles.module.scss";
import clsx from "clsx";
import Tilt from "react-parallax-tilt";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useWeb3React } from "@web3-react/core";

const PackDetailIDComponent: React.FC<any> = ({ id, inventory }) => {
  const { account: user, provider } = useWeb3React();
  const NFTs = useAppSelector((state) => state.nfts);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const cards = convertArrayCards();

  const [message, setMessage] = React.useState(
    "You will have to make two transactions. The first one to approve us to have listed your tokens and the second one to list the tokens",
  );

  const [sellNFTData, setSellNFTData] = React.useState({
    startingPrice: 0,
    amount: 0,
    duration: 0,
  });

  const { Modal, show, hide, isShow } = useModal();

  const sellNft = async () => {
    if (sellNFTData.amount > NFTs.balancePacks[id].balance) {
      return alert("You don't have enough tokens to sell");
    }
    if (sellNFTData.amount < 1) {
      return alert("You have to put more than 1 NFT to sell");
    }
    if (sellNFTData.startingPrice <= 0) {
      return alert("You have to put a valid sell price");
    }
    if (sellNFTData.duration <= 3600 * 24) {
      return alert("You have to put a end date higher than 1 day");
    }
    try {
      const tokenId = id;
      const { pack, marketplace } = getAddresses();
      const packs = getContractCustom("ERC1155", pack, provider);
      console.log(sellNFTData);
      // const isApprovedForAll = await packs.methods.isApprovedForAll(
      //   user?.ethAddress,
      //   marketplace,
      // );
      // console.log(isApprovedForAll);
      // if (isApprovedForAll == false) {
      setMessage("Allowing us to sell your tokens");
      await approveERC1155({
        provider: provider.provider,
        from: user,
        to: marketplace,
        address: pack,
      });
      // }
      setMessage("Listing your tokens");
      await dispatch(
        onSellERC1155({
          address: pack,
          from: user,
          startingPrice: Web3.utils.toWei(sellNFTData.startingPrice.toString()),
          amount: sellNFTData.amount,
          tokenId: tokenId,
          duration: sellNFTData.duration.toString(),
          provider: provider.provider,
          user: user,
        }),
      );
    } catch (err) {
      console.log({ err });
    }

    dispatch(onLoadSales());
    dispatch(onGetAssets(user));

    setMessage(
      "You will have to make two transactions. The first one to approve us to have listed your tokens and the second one to list the tokens",
    );
    hide();
    setSellNFTData({
      startingPrice: 0,
      amount: 0,
      duration: 0,
    });
  };
  React.useEffect(() => {
    console.log("nft data", sellNFTData);
  }, [sellNFTData]);

  return (
    <>
      <Modal isShow={isShow} withoutX>
        {id ? (
          <div className="flex flex-col items-center gap-4 bg-secondary rounded-md p-8 max-w-xl">
            <h2 className="font-bold text-primary text-center">Sell NFT</h2>
            <div className="flex md:flex-row flex-col md:gap-16 gap-4 w-full items-center">
              <Tilt>
                <div className="h-auto w-auto">
                  <img
                    src={packs[id]?.properties?.image?.value}
                    className={clsx(Styles.animatedImage)}
                    alt=""
                  />
                </div>
              </Tilt>
              <div
                className="flex flex-col gap-4 justify-between md:w-64"
                style={{ maxWidth: "100vw" }}
              >
                <div className="flex flex-col gap-4 w-full justify-center items-center">
                  <label className="text-primary font-medium">
                    Starting price for each NFT (ONE)
                  </label>
                  <input
                    type="number"
                    className="bg-overlay text-primary text-center"
                    value={sellNFTData.startingPrice}
                    min={0}
                    onChange={(e) => {
                      setSellNFTData((prev: any) => {
                        return { ...prev, startingPrice: e.target.value };
                      });
                    }}
                  />
                </div>
                <div className="flex flex-col gap-4 w-full justify-center items-center">
                  <label className="text-primary font-medium">
                    Amount of NFTs
                  </label>
                  <input
                    type="number"
                    className="bg-overlay text-primary text-center"
                    value={sellNFTData.amount}
                    min={1}
                    onChange={(e) => {
                      setSellNFTData((prev: any) => {
                        return { ...prev, amount: parseInt(e.target.value) };
                      });
                    }}
                  />
                </div>
                <div className="flex flex-col gap-4 w-full justify-center items-center">
                  <label className="text-primary font-medium">End Date</label>
                  <input
                    type="date"
                    className="bg-overlay text-primary text-center"
                    onChange={(e) => {
                      const date = new Date(e.target.value + " 00:00");
                      setSellNFTData((prev: any) => {
                        return {
                          ...prev,
                          duration:
                            Math.floor(date.getTime() / 1000) -
                            Math.floor(new Date().getTime() / 1000),
                        };
                      });
                    }}
                  />
                </div>
                <div className="py-6">
                  <div className="text-primary text-sm text-center flex flex-col items-center justify-center">
                    {message ===
                    "You will have to make two transactions. The first one to approve us to have listed your tokens and the second one to list the tokens" ? (
                      message
                    ) : (
                      <>
                        <span className="flex gap-4 items-center justify-center">
                          {message} <LoadingOutlined />
                        </span>
                        <span className="flex gap-4 mt-6 items-center justify-center">
                          {message === "Listing your tokens"
                            ? "Transaction 2/2"
                            : "Transaction 1/2"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex sm:flex-row flex-col gap-4 w-full justify-center items-center">
                  <Button
                    // className="px-4 py-2 border border-primary text-primary"
                    decoration="line-primary"
                    className="hover:text-white border-primary"
                    size="small"
                    onClick={() => {
                      hide();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    // className="px-4 py-2 border border-primary text-primary"
                    decoration="fillPrimary"
                    className="degradated hover:text-white border-none"
                    size="small"
                    onClick={sellNft}
                  >
                    List NFT/s
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </Modal>
      {id ? (
        <div className="min-h-screen w-full flex flex-col xl:px-20 md:px-10 sm:px-6 pt-32 pb-20">
          <div className="flex sm:flex-row flex-col sm:justify-between  w-full">
            <div className="flex flex-col gap-2">
              <div
                className="cursor-pointer text-white flex font-bold items-center gap-1"
                onClick={() => router.back()}
              >
                <LeftOutlined />
                Back
              </div>
              <Typography type="title" className="text-primary">
                Pack #{id}
              </Typography>
              {/* <Typography type="title" className="text-primary">
                Transaction #{id}
              </Typography> */}
            </div>
            <div className="flex gap-2 items-start sm:mt-0 mt-4 sm:justify-end justify-between">
              {NFTs.balancePacks[id] && NFTs.balancePacks[id].balance && (
                <Button
                  decoration="fillPrimary"
                  className="degradated hover:text-white border-none"
                  size="small"
                  onClick={() => show()}
                >
                  <img
                    src={Icons.harmony}
                    className="h-6 w-6 rounded-full mr-2"
                    alt=""
                  />{" "}
                  Sell now
                </Button>
              )}
            </div>
          </div>
          <div className="w-full flex md:flex-row flex-col mt-10">
            <div className="flex relative justify-center md:w-1/2 xl:px-24">
              <Tilt>
                {" "}
                <div className="sm:sticky sm:top-32 h-min w-auto">
                  <img
                    src={
                      id == 0
                        ? Images.pack1
                        : id == 1
                        ? Images.pack2
                        : id == 2
                        ? Images.pack3
                        : Images.pack4
                    }
                    className={clsx(Styles.animatedImageMain)}
                    alt=""
                  />
                </div>
              </Tilt>
            </div>
            <div className="flex flex-col md:w-1/2">
              <div className="flex flex-col">
                <Typography type="title" className="text-primary font-bold">
                  About
                </Typography>
                <div className="flex flex-col gap-4 px-10 py-6 border border-primary rounded-xl mt-4">
                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col">
                      <Typography
                        type="subTitle"
                        className="text-white font-bold"
                      >
                        NAME
                      </Typography>
                      <Typography
                        type="subTitle"
                        className="text-primary opacity-75"
                      >
                        {packs[id].properties.name.value}
                      </Typography>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col">
                      <Typography
                        type="subTitle"
                        className="text-white font-bold"
                      >
                        DESCRIPTION
                      </Typography>
                      <Typography
                        type="subTitle"
                        className="text-primary opacity-75"
                      >
                        {packs[id].properties.description.value}
                      </Typography>
                    </div>
                  </div>
                  {NFTs.balancePacks[id] && NFTs.balancePacks[id].balance && (
                    <div>
                      <div className="flex flex-col">
                        <Typography
                          type="subTitle"
                          className="text-white font-bold"
                        >
                          YOUR BALANCE
                        </Typography>
                        <Typography
                          type="subTitle"
                          className="text-primary opacity-75"
                        >
                          {NFTs.balancePacks[id].balance}
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default PackDetailIDComponent;
