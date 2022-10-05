import React from "react";
import { LeftOutlined, LoadingOutlined, MenuOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Web3 from "web3";
import { useMoralis } from "react-moralis";

import { useAppDispatch } from "redux/store";
import { onBuyERC1155, onLoadSales, onGetAssets } from "@redux/actions";
import { Button } from "../common/button/button";
import { Icons } from "@shared/const/Icons";
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
import { DropdownActions } from "../common/dropdownActions/dropdownActions";

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
  const [currentOrder, setCurrentOrder] = React.useState("lowest_price");
  const orderMapper = {
    lowest_price: "Price: Low to High",
    highest_price: "Price: High to Low",
  };

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
        }),
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
            <div className="flex sm:flex-row flex-col gap-4 w-full items-center">
              {/* <div className="px-10 py-8"> */}

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
                      },
                    )}
                    alt=""
                  />
                </div>
              </Tilt>
              {/* </div> */}
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
                    <Typography type="caption" className="text-red-primary">
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
        <div className="min-h-screen w-full flex flex-col xl:px-36 md:px-10 sm:px-6 px-4 pt-10 pb-20">
          <div className="w-full flex xl:flex-row flex-col mt-10 gap-4 justify-center">
            <div className="flex flex-col gap-2">
              <div className="flex relative items-center justify-center xl:min-w-[500px] min-w-[320px] min-h-[675px] py-10 xl:px-24 rounded-md bg-secondary cursor-pointer relative overflow-hidden border border-gray-500">
                <img
                  src={
                    isPack
                      ? packs[sale?.nftId].properties.image.value
                      : cards[sale?.nftId]?.properties?.image?.value ||
                        Icons.logo
                  }
                  className="absolute xl:top-[-20%] top-[-25%] bottom-0 xl:left-[-55%] left-[-35%] right-0 margin-auto opacity-50 xl:min-w-[1050px] min-w-[175%]"
                  alt=""
                />
                <Tilt className="flex items-center justify-center">
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
                        },
                      )}
                      alt=""
                    />
                  </div>
                </Tilt>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-4 px-6 py-6 border border-overlay-border bg-secondary rounded-xl mt-4 relative">
                  <p className="absolute top-4 right-6 text-overlay-border text-sm">
                    OWNER INFO
                  </p>
                  <img src={Icons.logoCard} className="w-16 h-16" alt="" />
                  <div className="flex flex-col">
                    <h2 className="text-xl font-[450] text-white">
                      Owner Name
                    </h2>
                    <p className="text-overlay-border text-xl font-bold">
                      <AddressText text={sale.seller}></AddressText>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col xl:w-max w-full py-10">
              <div className="flex flex-col w-full md:min-h-[620px] md:max-h-[620px]">
                <div className="flex flex-col">
                  <h1 className="text-primary uppercase md:text-4xl text-3xl font-bold">
                    {isPack
                      ? packs[sale?.nftId].properties.name.value
                      : cards[sale?.nftId]?.properties?.name?.value}
                  </h1>
                  <div className="flex flex-col md:px-6 md:py-4 p-2 border border-overlay-border bg-secondary rounded-xl mt-4 relative">
                    <p className="absolute md:top-4 md:right-6 top-2 right-4 text-overlay-border text-sm">
                      BUY PANEL
                    </p>
                    <div className="flex flex-row gap-4 w-full">
                      <h2 className="md:text-2xl text-lg font-[450] text-white">
                        Current price:
                      </h2>
                    </div>
                    <div className="flex flex-row xl:gap-32 gap-16 w-full">
                      <div className="flex flex-col">
                        <h2 className="md:text-3xl text-xl font-[450] text-white whitespace-nowrap">
                          {Web3.utils.fromWei(sale.price, "ether")} ONE{" "}
                          <span className="!text-sm text-overlay-border">
                            ($1.500)
                          </span>
                        </h2>
                        <img
                          src="/icons/HARMONY.svg"
                          className="md:h-10 md:w-10 w-8 h-8"
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col gap-4 w-full items-center md:pl-10 md:pr-16 pr-4">
                        <Button
                          decoration="fill"
                          className="md:w-48 w-32 md:text-lg text-md py-[6px] rounded-lg text-overlay !bg-green-button hover:!bg-secondary hover:!text-green-button hover:!border-green-button"
                          onClick={() => {
                            show();
                          }}
                        >
                          Buy Now
                        </Button>
                        <Button
                          decoration="line-white"
                          className="bg-dark md:text-lg text-md md:w-48 w-32 py-[6px] rounded-lg text-white hover:text-overlay border-none"
                        >
                          Make Offer
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 w-full justify-between">
                      <div className="flex flex-col w-1/2 justify-end">
                        <p className="text-primary-disabled md:text-lg text-md">
                          Time left:{" "}
                          <span className="text-white font-bold md:text-xl text-lg">
                            6h 8m
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col gap-4 pb-2">
                        <img
                          src={Icons.logo}
                          className="md:w-12 md:h-12 w-8 h-8"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col pt-2 h-full">
                  <div className="flex flex-col px-6 py-4 border border-overlay-border bg-secondary rounded-xl mt-4 relative min-h-full">
                    <p className="absolute top-4 right-6 text-overlay-border text-sm">
                      OFFERS
                    </p>
                    <div className="flex flex-row gap-4 w-full pb-2">
                      <h2 className="md:text-2xl text-lg font-[450] text-white">
                        Offers
                      </h2>
                    </div>
                    <div className="flex flex-row xl:gap-20 gap-16 w-full">
                      <DropdownActions
                        title={orderMapper[currentOrder]}
                        className="!py-2 !bg-dark !rounded-xl !px-4 !text-white"
                        actions={[
                          {
                            label: "Price: Low to High",
                            onClick: () => setCurrentOrder("lowest_price"),
                          },
                          {
                            label: "Price: High to Low",
                            onClick: () => setCurrentOrder("highest_price"),
                          },
                        ]}
                      />
                    </div>
                    <div className="h-full flex flex-col items-center justify-center text-white font-bold gap-4">
                      <img src={Icons.logoCard} className="w-24 h-24" alt="" />
                      There aren't offers for this NFT
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full min-h-[400px] max-h-[400px]">
                <div className="flex flex-col pt-6 ">
                  <div className="flex items-center gap-4 px-6 py-6 border border-overlay-border bg-secondary rounded-xl mt-4 relative">
                    <p className="absolute top-4 right-6 text-overlay-border text-sm">
                      OWNER INFO
                    </p>
                    <img src={Icons.logoCard} className="w-16 h-16" alt="" />
                    <div className="flex flex-col">
                      <h2 className="md:text-xl text-lg font-[450] text-white">
                        Owner Name
                      </h2>
                      <p className="text-primary-disabled md:text-xl text-lg font-bold">
                        <AddressText text={sale.seller}></AddressText>
                      </p>
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
