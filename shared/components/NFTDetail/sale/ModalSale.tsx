import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button } from "@shared/components/common/button/button";
import { Icons } from "@shared/const/Icons";
import { useBlockchain } from "@shared/context/useBlockchain";
import { formatPrice } from "@shared/utils/formatPrice";
import clsx from "clsx";
import React from "react";
import Styles from "../styles.module.scss";
import Tilt from "react-parallax-tilt";
import { convertArrayCards } from "@shared/components/common/convertCards";
import packs from "../../../packs.json";
import { getTokensAllowedMatic } from "@shared/web3";
import { CHAINS, CHAIN_IDS_BY_NAME } from "@shared/components/chains";
import { multiply } from "@shared/components/utils";

export const ModalSale = ({
  isPack,
  sale,
  setBuyNFTData,
  message,
  buyNFTData,
  buyNft,
  hide,
  setTokenSelected,
  tokenSelected,
}) => {
  const cards: any[] = convertArrayCards();
  const tokensAllowed = getTokensAllowedMatic();

  return (
    <div className="flex flex-col items-center gap-4 bg-secondary rounded-md p-12 border border-overlay-border w-auto relative">
      <h2 className="font-bold text-primary text-center uppercase text-3xl">
        BUY{" "}
        {isPack
          ? packs[sale?.nftId].properties.name.value
          : cards[sale?.nftId]?.properties?.name?.value}
      </h2>
      <div className="flex sm:flex-row flex-col gap-4 w-full items-center justify-center md:w-[750px]">
        <Tilt className="w-60">
          <div className="w-full h-96 flex items-center">
            <img
              src={
                isPack
                  ? packs[sale?.nftId].properties.image.value
                  : cards[sale?.nftId]?.properties?.image?.value || Icons.logo
              }
              className={clsx(
                Styles.animatedImage,
                {
                  "rounded-full": !isPack
                    ? cards[sale.nftId].typeCard === "avatar"
                    : false,
                },
                {
                  "rounded-md": !isPack
                    ? cards[sale.nftId].typeCard !== "avatar"
                    : false,
                },
                "w-96",
              )}
              alt=""
            />
          </div>
        </Tilt>
        {/* </div> */}
        <div className="flex flex-col gap-4  justify-between">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center sm:flex-row gap-4 flex-col w-96">
              <label className="text-primary font-bold text-lg w-full">
                Amount of NFTs
              </label>

              <input
                type="number"
                className="bg-overlay text-primary text-center w-24 shrink-0 py-2 rounded-md border border-overlay-border"
                onChange={(e) => {
                  setBuyNFTData(parseInt(e.target.value));
                }}
              />
            </div>
            {buyNFTData > sale?.amount && (
              <div className="text-red-primary flex gap-2 items-center w-full text-[13px]">
                <ExclamationCircleOutlined />
                <caption>
                  The quantity of tokens can't exceed available to buy
                </caption>
              </div>
            )}
          </div>
          <div className="flex sm:flex-row flex-col gap-4 w-full justify-between items-center">
            <label className="text-primary font-bold text-lg">
              Total Price:
            </label>
            {sale && sale.price && (
              <span className="text-white w-24 text-center font-bold text-green-button">
                {isNaN(
                  parseInt(formatPrice(sale.price, sale.blockchain)) *
                    buyNFTData,
                )
                  ? 0
                  : formatPrice(
                      multiply(sale?.price, buyNFTData.toString()),
                      sale.blockchain,
                    )}
              </span>
            )}
          </div>
          {sale.blockchain === "matic" ? (
            <div className="flex  gap-4 w-full flex-wrap items-center justify-center">
              {tokensAllowed
                .filter((item) =>
                  sale?.tokens
                    ?.map((item) => item.toLowerCase())
                    ?.includes(item.address.toLowerCase()),
                )
                .map((item, index) => {
                  return (
                    <div
                      className={clsx(
                        "w-28 flex items-center justify-center gap-2 rounded-xl cursor-pointer p-2",
                        {
                          "bg-overlay-border border-white":
                            tokenSelected?.address == item.address,
                        },
                        {
                          "bg-overlay": tokenSelected?.address !== item.address,
                        },
                      )}
                      onClick={() => {
                        setTokenSelected(item);
                      }}
                    >
                      <img src={item.logo} className="w-8 h-8" alt="" />
                      <h2 className="text-white text-lg font-bold">
                        {item.name}
                      </h2>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div
              className={clsx(
                "w-28 flex items-center justify-center gap-2 rounded-xl cursor-pointer p-2",
                "bg-overlay-border border-white",
              )}
            >
              <img
                src={`/images/${sale.blockchain}.png`}
                className="w-8 h-8"
                alt=""
              />
              <h2 className="text-white text-lg font-bold uppercase">
                {
                  CHAINS[CHAIN_IDS_BY_NAME[sale.blockchain]].nativeCurrency
                    .symbol
                }
              </h2>
            </div>
          )}
          <div className="flex gap-4 items-center justify-center">
            <img
              src={`/images/${sale.blockchain}.png`}
              className="md:h-10 md:w-10 w-8 h-8"
              alt=""
            />
            <img src={Icons.logo} className="md:w-12 md:h-12 w-8 h-8" alt="" />
          </div>
          <div className="py-4">
            <div className="text-primary text-sm text-center flex flex-col items-center justify-center">
              {message === "Buying tokens" && (
                <>
                  <span className="flex gap-4 items-center justify-center">
                    {message} <LoadingOutlined />
                  </span>
                  <span className="flex gap-4 items-center justify-center">
                    Note: If the transaction doesn't appears please open your
                    wallet manually
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex sm:flex-row flex-col gap-4 w-full justify-center items-center">
            <Button
              decoration="line-white"
              className="bg-dark  !font-bold md:text-lg w-28 text-md py-[6px] rounded-lg text-white hover:text-overlay border-none"
              onClick={() => {
                setBuyNFTData(0);
                hide();
              }}
            >
              Cancel
            </Button>
            <Button
              decoration="fill"
              className="w-28 !font-bold text-md py-[6px] rounded-lg !text-overlay !bg-green-button hover:!bg-secondary hover:!text-green-button hover:!border-green-button"
              onClick={buyNFTData > sale?.amount ? undefined : buyNft}
              disabled={buyNFTData > sale?.amount}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
