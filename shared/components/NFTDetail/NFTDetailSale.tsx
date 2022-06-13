import React from "react";
import {LeftOutlined, LoadingOutlined, MenuOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";
import Web3 from "web3";
import {useMoralis} from "react-moralis";

import {useAppDispatch} from "redux/store";
import {onBuyERC1155, onLoadSales, onGetAssets} from "@redux/actions";
import {Button} from "../common/button/button";
import {Icons} from "@shared/const/Icons";
import { AddressText, Type } from "../common/specialFields/SpecialFields";
import { getAddresses, loadSale } from "@shared/web3";
import { Typography } from "../common/typography";
import packs from "../../packs.json";
import { TimeConverter } from "../common/unixDateConverter/unixConverter";
import { useModal } from "@shared/hooks/modal";
import { convertArrayCards } from "../common/convertCards";
import clsx from "clsx";
import Styles from "./styles.module.scss";
import Tilt from "react-parallax-tilt";

const NFTDetailSaleComponent: React.FC<any> = ({ id }) => {
  const { user, Moralis, isWeb3Enabled } = useMoralis();
  const [sale, setSale] = React.useState<any>();
  const [buyNFTData, setBuyNFTData] = React.useState(0);
  const { Modal, show, hide, isShow } = useModal();
  const [isPack, setIsPack] = React.useState(false);
  const [saleData, setSaleData] = React.useState(false);
  const { isAuthenticated } = useMoralis();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const cards: any[] = convertArrayCards();

  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (id) {
      getSale();
    }
  }, [id]);

  const getSale = async () => {
    const sale = await loadSale(id);
    const { pack } = getAddresses();
    if (sale.nft === pack) {
      setIsPack(true);
    } else {
      setIsPack(false);
    }
    setSale(sale);
  };

  const buyNft = async () => {
    if (!isAuthenticated) {
      router.push("/login");
    }
    try {
      setMessage("Buying tokens");
      const { pack, endersGate } = getAddresses();
      await dispatch(
        onBuyERC1155({
          seller: sale.seller,
          amount: buyNFTData,
          bid: Web3.utils
            .toBN(sale.price)
            .mul(Web3.utils.toBN(buyNFTData))
            .toString(),
          tokenId: id,
          moralis: Moralis,
          nftContract: isPack ? pack : endersGate,
        })
      );
    } catch {}
    setMessage("");
    await getSale();
    hide();
    dispatch(onLoadSales());
    dispatch(onGetAssets(user.get("ethAddress")));
    setBuyNFTData(0);
  };

  const notAvailable =
    sale?.status != 0 ||
    Math.floor(new Date().getTime() / 1000) >=
      parseInt(sale?.duration) + parseInt(sale?.startedAt);

  return (
    <>
      <Modal isShow={isShow} withoutX>
        {id !== undefined && sale !== undefined ? (
          <div className="flex flex-col items-center gap-4 bg-secondary rounded-md p-8 max-w-xl">
            <h2 className="font-bold text-primary text-center">Buy NFT</h2>
            <div className="flex sm:flex-row flex-col sm:gap-16 gap-4 w-full items-center">
              <Tilt>
                <div className="h-auto">
                  <img
                    src={
                      isPack
                        ? packs[sale?.nftId].properties.image.value
                        : cards[sale?.nftId]?.properties?.image?.value ||
                          Icons.logo
                    }
                    className={clsx(
                      Styles.animatedImage,
                      {
                        "rounded-full": !isPack
                          ? cards[sale.nftId].typeCard == "avatar"
                          : false,
                      },
                      {
                        "rounded-md": !isPack
                          ? cards[sale.nftId].typeCard != "avatar"
                          : false,
                      }
                    )}
                    alt=""
                  />
                </div>
              </Tilt>
              <div className="flex flex-col gap-4  justify-between">
                <div className="flex sm:flex-row flex-col gap-4 w-full justify-end items-center">
                  <label className="text-primary font-medium">
                    Amount of NFTs
                  </label>
                  <input
                    type="number"
                    className="bg-overlay text-primary text-center w-24"
                    onChange={(e) => {
                      setBuyNFTData(parseInt(e.target.value));
                    }}
                  />
                  {buyNFTData > sale?.amount && (
                    <Typography type="caption" className="text-red-600">
                      The quantity of tokens can't exceed available to buy
                    </Typography>
                  )}
                </div>
                <div className="flex sm:flex-row flex-col gap-4 w-full justify-center items-center">
                  <label className="text-primary font-medium">
                    Total Price:
                  </label>
                  {sale && (
                    <span className="text-white">
                      {buyNFTData *
                        parseFloat(Web3.utils.fromWei(sale.price, "ether"))}
                    </span>
                  )}
                </div>
                <div className="py-6">
                  <div className="text-primary text-sm text-center flex items-center justify-center">
                    {message === "Buying tokens" && (
                      <span className="flex gap-4 items-center justify-center">
                        {message} <LoadingOutlined />
                      </span>
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
                      setBuyNFTData(0);
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
                    onClick={buyNFTData > sale?.amount ? undefined : buyNft}
                    disabled={buyNFTData > sale?.amount}
                  >
                    Buy NFT/s
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </Modal>
      {id !== undefined && sale !== undefined ? (
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
                {isPack ? `Pack #${sale?.nftId}` : `Card #${sale?.nftId}`}
              </Typography>
              <Typography type="title" className="text-primary">
                Sale #{id}
              </Typography>
            </div>
            <div className="flex gap-2 items-center sm:mt-0 mt-4 sm:justify-end justify-between">
              {!notAvailable && (
                <>
                  {" "}
                  <div className="flex flex-col items-end">
                    <div className="text-primary font-bold flex items-center gap-2">
                      <MenuOutlined />
                      <Typography type="title">
                        {Web3.utils.fromWei(sale.price, "ether")} ONE
                      </Typography>
                      {/* <Typography type="subTitle" className="text-white">
                    $116.15
                  </Typography> */}
                    </div>

                    <Typography type="subTitle" className="text-white">
                      Amount Available: {sale.amount}
                    </Typography>
                  </div>
                  <Button
                    decoration="fillPrimary"
                    className="degradated hover:text-white border-none"
                    size="small"
                    onClick={() => {
                      show();
                    }}
                  >
                    <img src={Icons.harmony} className="h-6 w-6" alt="" /> Buy
                    now
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="w-full flex md:flex-row flex-col mt-10">
            <div className="flex relative justify-center md:w-1/2 xl:px-24">
              <Tilt>
                <div className="sm:sticky sm:top-32 h-min w-auto">
                  <img
                    src={
                      isPack
                        ? packs[sale.nftId].properties.image.value
                        : cards[sale.nftId].properties.image?.value ||
                          Icons.logo
                    }
                    className={clsx(
                      Styles.animatedImageMain,
                      {
                        "rounded-full": !isPack
                          ? cards[sale.nftId].typeCard == "avatar"
                          : false,
                      },
                      {
                        "rounded-md": !isPack
                          ? cards[sale.nftId].typeCard != "avatar"
                          : false,
                      }
                    )}
                    alt=""
                  />
                </div>
              </Tilt>
            </div>
            <div className="flex flex-col md:w-1/2">
              <div className="flex flex-col">
                <Typography type="title" className="text-primary font-bold">
                  About NFT
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
                        {isPack
                          ? packs[sale.nftId].properties.name.value
                          : cards[sale.nftId].properties.name?.value}
                      </Typography>
                    </div>
                    {!isPack &&
                      (cards[sale.nftId].properties.type?.value ||
                        cards[sale.nftId].properties.attack?.value) && (
                        <div className="flex flex-col">
                          <Typography
                            type="subTitle"
                            className="text-white font-bold"
                          >
                            TYPE
                          </Typography>
                          <Typography
                            type="subTitle"
                            className="text-primary opacity-75"
                          >
                            <Type id={sale.nftId}></Type>
                          </Typography>
                        </div>
                      )}
                    {!isPack && cards[sale.nftId].properties.rarity?.value && (
                      <div className="flex flex-col">
                        <Typography
                          type="subTitle"
                          className="text-white font-bold"
                        >
                          RARITY
                        </Typography>
                        <Typography
                          type="subTitle"
                          className="text-primary opacity-75"
                        >
                          {cards[sale.nftId].properties.rarity?.value}
                        </Typography>
                      </div>
                    )}
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
                        {isPack
                          ? packs[sale.nftId].properties.description.value
                          : cards[sale.nftId].properties.description?.value}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col pt-6">
                <Typography type="title" className="text-primary font-bold">
                  Sale Details
                </Typography>
                <div className="flex flex-col gap-4 px-10 py-6 border border-primary rounded-xl mt-4">
                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col">
                      <Typography
                        type="subTitle"
                        className="text-white font-bold"
                      >
                        OWNER
                      </Typography>
                      <Typography
                        type="subTitle"
                        className="text-primary opacity-75"
                      >
                        <AddressText text={sale.seller}></AddressText>
                      </Typography>
                    </div>
                    <div className="flex flex-col">
                      <Typography
                        type="subTitle"
                        className="text-white font-bold"
                      >
                        AMOUNT OF {isPack ? "PACKS" : "CARDS"} AVAILABLE
                      </Typography>
                      <Typography
                        type="subTitle"
                        className="text-primary opacity-75"
                      >
                        {sale.amount}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col">
                      <Typography
                        type="subTitle"
                        className="text-white font-bold"
                      >
                        FINISH AT
                      </Typography>
                      <Typography
                        type="subTitle"
                        className="text-primary opacity-75"
                      >
                        <TimeConverter
                          UNIX_timestamp={
                            parseInt(sale.duration) + parseInt(sale.startedAt)
                          }
                        ></TimeConverter>
                      </Typography>
                    </div>
                    <div className="flex flex-col">
                      <Typography
                        type="subTitle"
                        className="text-white font-bold"
                      >
                        STATUS
                      </Typography>
                      <Typography
                        type="subTitle"
                        className="text-primary opacity-75"
                      >
                        {sale.status == 0 &&
                        Math.floor(new Date().getTime() / 1000) <=
                          parseInt(sale?.duration) + parseInt(sale?.startedAt)
                          ? "Active"
                          : sale.status == 1
                          ? "Sold"
                          : sale.status == 2
                          ? "Cancelled"
                          : "Outdated"}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen w-screen bg-overlay flex items-center justify-center text-3xl text-primary">
          <LoadingOutlined />
        </div>
      )}
    </>
  );
};

export default NFTDetailSaleComponent;
