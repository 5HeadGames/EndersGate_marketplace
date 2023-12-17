import React from "react";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Web3 from "web3";

import { useAppDispatch, useAppSelector } from "redux/store";
import {
  sellERC1155,
  onLoadSales,
  onGetAssets,
  sellERC1155Native,
  listRentERC1155,
  listRentERC1155Native,
} from "@redux/actions";
import { Button } from "../../common/button/button";
import { Icons } from "@shared/const/Icons";
import {
  getAddresses,
  getContractCustom,
  getNativeBlockchain,
  getTokensAllowed,
  switchChain,
} from "@shared/web3";
import { Typography } from "../../common/typography";
import { approveERC1155 } from "@shared/web3";
import { convertArrayCards } from "../../common/convertCards";
import clsx from "clsx";
import Styles from "../styles.module.scss";
import Tilt from "react-parallax-tilt";
import { AddressText } from "../../common/specialFields/SpecialFields";
import ReactCardFlip from "react-card-flip";
import { CHAINS, CHAIN_IDS_BY_NAME } from "../../../utils/chains";
import { useBlockchain } from "@shared/context/useBlockchain";
import { ChevronLeftIcon, ExclamationCircleIcon } from "@heroicons/react/solid";
import { useModal } from "@shared/hooks/modal";
import { CongratsListing } from "./Congrats";
import { toast } from "react-hot-toast";
import ChainSelect from "@shared/components/Layouts/chainSelect";
import { useUser } from "@shared/context/useUser";

const NFTDetailIDComponent: React.FC<any> = ({ id, inventory }) => {
  const NFTs = useAppSelector((state) => state.nfts);
  const [state, setState] = React.useState("choose");
  const router = useRouter();

  const cards = convertArrayCards();

  const { Modal, show, hide, isShow } = useModal();

  const [flippedCard, setFlippedCard] = React.useState(false);

  const { blockchain } = useBlockchain();

  const { endersGate } = getAddresses(blockchain);

  return (
    <>
      <Modal isShow={isShow} withoutX>
        <CongratsListing
          hide={hide}
          name={cards[id]?.properties?.name?.value}
          image={cards[id]?.image}
        />
      </Modal>
      {id !== undefined ? (
        <div className="min-h-screen w-full flex flex-col xl:px-36 md:px-10 sm:px-6 px-4 pt-20 pb-20">
          <div
            className="flex w-full text-lg items-center gap-2 text-white"
            onClick={() => router.back()}
          >
            <div className="flex items-center gap-2 cursor-pointer w-min">
              <ChevronLeftIcon className="w-8 h-8" />
            </div>
          </div>
          <div className="w-full flex xl:flex-row flex-col gap-4 justify-center xl:items-start items-center">
            <div className="flex flex-col gap-2 xl:w-auto w-full">
              <div className="flex relative items-center justify-center xl:min-w-[500px] sm:min-w-[320px] min-w-full sm:min-h-[675px] min-h-[350px] py-10 xl:px-24 rounded-md bg-secondary cursor-pointer overflow-hidden border border-gray-500">
                <div
                  className="absolute top-2 right-2 z-10 text-white text-2xl p-1"
                  onClick={() => setFlippedCard((prev) => !prev)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <img
                  src={cards[id].image}
                  className="absolute xl:top-[-20%] top-[-25%] bottom-0 xl:left-[-55%] left-[-35%] right-0 margin-auto opacity-50 xl:min-w-[1050px] min-w-[175%]"
                  alt=""
                />

                <div className="sm:sticky sm:top-20 h-min w-auto">
                  <ReactCardFlip
                    isFlipped={flippedCard}
                    flipDirection="horizontal"
                  >
                    <Tilt className="flex items-center justify-center">
                      <img
                        src={cards[id].image || Icons.logo}
                        className={clsx(
                          Styles.animatedImageMain,
                          { ["hidden"]: flippedCard },

                          {
                            "rounded-full": cards[id].typeCard == "avatar",
                          },
                          {
                            "rounded-md": cards[id].typeCard != "avatar",
                          },
                        )}
                        alt=""
                      />
                    </Tilt>

                    <Tilt className="flex items-center justify-center">
                      <img
                        src={`/images/${cards[id].typeCard.toLowerCase()}.png`}
                        className={clsx(
                          Styles.animatedImageMain,
                          { ["hidden"]: !flippedCard },
                          {
                            "rounded-full": cards[id].typeCard == "avatar",
                          },
                          {
                            "rounded-md": cards[id].typeCard != "avatar",
                          },
                        )}
                        alt=""
                      />
                    </Tilt>
                  </ReactCardFlip>
                </div>
              </div>
            </div>
            <div className="flex flex-col xl:w-[500px] gap-6 w-full pb-10">
              {NFTs.balanceCards[id]?.balance > 0 && (
                <div className="flex flex-col">
                  <h1 className="text-primary uppercase md:text-4xl text-3xl font-bold">
                    {cards[id]?.properties?.name?.value}
                  </h1>
                  {state == "choose" ? (
                    <div className="flex flex-col">
                      <div className="flex flex-col items-center gap-4 py-2 border border-overlay-border bg-secondary rounded-xl mt-4 relative px-2">
                        <div
                          className={clsx(
                            "hover:opacity-75 opacity-100",
                            "w-full relative cursor-pointer",
                          )}
                          onClick={() => setState("sell")}
                        >
                          <div className="absolute top-0 bottom-0 right-0 left-0 m-auto flex flex-col items-center justify-center">
                            <h2 className="text-2xl font-bold text-white pb-2">
                              Sell Card
                            </h2>
                            <p className="text-sm font-bold text-white">
                              Peer to Peer Card Sales:
                            </p>
                            <span className="text-sm text-overlay-border font-[500]">
                              Exchange cards with other payers.
                            </span>
                          </div>
                          <img src="/images/bg_sale.png" alt="rent" />
                        </div>
                        <div
                          className={clsx(
                            "hover:opacity-75 opacity-100",
                            "w-full relative cursor-pointer",
                          )}
                          onClick={() => setState("rent")}
                        >
                          <div className="absolute top-0 bottom-0 right-0 left-0 m-auto flex flex-col items-center justify-center">
                            <h2 className="text-2xl font-bold text-white pb-2">
                              Rent Card
                            </h2>
                            <p className="text-sm font-bold text-white">
                              Peer to Peer Card Rentals:
                            </p>
                            <span className="text-sm text-overlay-border font-[500]">
                              Rent out the card for a fixed period of time.
                            </span>
                          </div>
                          <img src="/images/bg_rent.png" alt="rent" />
                        </div>
                      </div>
                    </div>
                  ) : state === "sell" ? (
                    <SellPanel
                      id={id}
                      blockchain={blockchain}
                      NFTs={NFTs}
                      setState={setState}
                      show={show}
                    />
                  ) : (
                    <RentPanel
                      id={id}
                      blockchain={blockchain}
                      NFTs={NFTs}
                      setState={setState}
                      show={show}
                    />
                  )}
                </div>
              )}
              <TokenInfo
                id={id}
                blockchain={blockchain}
                NFTs={NFTs}
                endersGate={endersGate}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen w-full bg-overlay flex items-center justify-center text-3xl text-primary">
          <LoadingOutlined />
        </div>
      )}
    </>
  );
};

const SellPanel = ({ id, blockchain, show, NFTs, setState }) => {
  const {
    user: { ethAddress: user, provider },
  } = useUser();

  const dispatch = useAppDispatch();

  const { updateBlockchain } = useBlockchain();

  const [message, setMessage] = React.useState(
    "You will have to make two transactions (if you haven't approved us before, instead you will get one). The first one to approve us to have listed your tokens and the second one to list the tokens",
  );

  const [tokensSelected, setTokensSelected] = React.useState([]);

  const [sellNFTData, setSellNFTData] = React.useState({
    startingPrice: 0,
    amount: 0,
    duration: 0,
  });

  React.useEffect(() => {
    setTokensSelected(getTokensAllowed(blockchain).map((item) => item.address));
  }, []);

  const tokensAllowed = getTokensAllowed(blockchain);

  const sellNft = async () => {
    if (sellNFTData.amount > NFTs.balanceCards[id].balance) {
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
    if (tokensSelected.length == 0) {
      return alert("You have to put at least one currency to accept");
    }
    try {
      console.log("starts");
      const changed = await switchChain(CHAIN_IDS_BY_NAME[blockchain]);
      console.log(changed);
      if (!changed) {
        throw Error(
          "An error has occurred while switching chain, please try again.",
        );
      }
      console.log("updates blockchain");

      updateBlockchain(blockchain);
      const tokenId = id;
      console.log(blockchain);
      const { endersGate, marketplace } = getAddresses(blockchain);
      const endersgateInstance = getContractCustom(
        "EndersGate",
        endersGate,
        provider,
      );

      console.log("conditional");

      if (getNativeBlockchain(blockchain)) {
        const isApprovedForAll = await endersgateInstance.methods
          .isApprovedForAll(user, marketplace)
          .call();
        if (isApprovedForAll === false) {
          setMessage("Allowing us to sell your tokens");
          await approveERC1155({
            provider: provider,
            from: user,
            to: marketplace,
            address: endersGate,
          });
        }
        setMessage("Listing your tokens");
        const tx = await dispatch(
          sellERC1155Native({
            address: endersGate,
            from: user,
            startingPrice: Web3.utils.toWei(
              sellNFTData.startingPrice.toString(),
              "ether",
            ),
            blockchain,
            amount: sellNFTData.amount,
            tokenId: tokenId,
            duration: sellNFTData.duration.toString(),
            provider: provider,
            // user: user,
          }),
        );
        if (!tx.payload) {
          throw Error("");
        }
      } else {
        const isApprovedForAll = await endersgateInstance.methods
          .isApprovedForAll(user, marketplace)
          .call();
        if (isApprovedForAll === false) {
          setMessage("Allowing us to sell your tokens");
          await approveERC1155({
            provider: provider,
            from: user,
            to: marketplace,
            address: endersGate,
          });
        }
        setMessage("Listing your tokens");

        const tx = await dispatch(
          sellERC1155({
            address: endersGate,
            from: user,
            startingPrice: (sellNFTData.startingPrice * 10 ** 6).toString(),
            amount: sellNFTData.amount,
            tokenId: tokenId,
            tokens: tokensSelected,
            duration: sellNFTData.duration.toString(),
            provider: provider,
            // user: user,
            blockchain,
          }),
        );
        if (!tx.payload) {
          throw Error("");
        }
      }
      dispatch(onLoadSales());
      show();
      dispatch(onGetAssets({ address: user, blockchain }));
      setState("choose");

      setSellNFTData({
        startingPrice: 0,
        amount: 0,
        duration: 0,
      });
    } catch (err) {
      toast.error(
        "An error has occurred while processing your listing. Please try again",
      );
      console.log({ err });
    }
    setMessage(
      "You will have to make two transactions (if you haven't approved us before, instead you will get one). The first one to approve us to have listed your tokens and the second one to list the tokens",
    );
  };

  return (
    <div className="flex flex-col  w-full">
      <div className="flex flex-col">
        <div className="flex flex-col md:px-6 py-10 p-2 border border-overlay-border bg-secondary rounded-xl mt-4 relative">
          <ChevronLeftIcon
            onClick={() => setState("choose")}
            className="absolute md:top-3 left-2 top-2 text-overlay-border text-sm w-6 text-white cursor-pointer"
          />

          <p className="absolute md:bottom-3 md:right-6 bottom-2 right-4 text-overlay-border text-[10px]">
            SELL PANEL
          </p>
          <div className="absolute md:top-3 right-2 top-2">
            <ChainSelect />
          </div>

          <div className="flex flex-row xl:gap-32 gap-16 w-full">
            <div className="flex flex-col gap-4 w-full items-center sm:px-8">
              <div className="flex gap-4 w-full justify-between items-center">
                <label className="text-primary font-bold whitespace-nowrap">
                  Price per NFT (
                  {getNativeBlockchain(blockchain)
                    ? CHAINS[CHAIN_IDS_BY_NAME[blockchain]].nativeCurrency
                        ?.symbol
                    : "USD"}
                  )
                </label>
                <input
                  type="number"
                  className="bg-overlay text-primary text-center w-16 p-1 font-bold rounded-xl border border-overlay-border"
                  value={sellNFTData.startingPrice}
                  min={0}
                  onChange={(e) => {
                    setSellNFTData((prev: any) => {
                      return {
                        ...prev,
                        startingPrice: e.target.value,
                      };
                    });
                  }}
                />
              </div>

              <div className="flex flex-col gap-2 w-full items-center">
                <div className="flex gap-4 w-full justify-between items-center">
                  <label className="text-primary font-bold whitespace-nowrap">
                    Amount of NFTs
                  </label>
                  <input
                    type="number"
                    className="bg-overlay text-primary text-center w-16 p-1 font-bold rounded-xl border border-overlay-border"
                    value={sellNFTData.amount}
                    min={1}
                    onChange={(e) => {
                      setSellNFTData((prev: any) => {
                        return {
                          ...prev,
                          amount: parseInt(e.target.value),
                        };
                      });
                    }}
                  />
                </div>{" "}
                {sellNFTData.amount > NFTs?.balanceCards[id]?.balance && (
                  <div className="flex gap-1 items-center justify-center">
                    <ExclamationCircleOutlined className="text-[13px] text-red-primary" />
                    <Typography type="caption" className="text-red-primary">
                      The amount can't be higher than your balance
                    </Typography>
                  </div>
                )}
              </div>

              <div className="flex  gap-4 w-full justify-between items-center">
                <label className="text-primary font-bold whitespace-nowrap">
                  End Date
                </label>
                <input
                  type="date"
                  className="bg-overlay text-primary text-center w-30 p-1 font-bold rounded-xl border border-overlay-border"
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
              {getNativeBlockchain(blockchain) ? (
                ""
              ) : (
                <>
                  {" "}
                  <div className="text-[11px] w-full text-left text-white font-bold">
                    Select at least 1 currency you want to accept as a payment
                    for this listing
                  </div>
                  <div className="flex  gap-4 w-full flex-wrap items-center justify-center">
                    {tokensAllowed.map((item, index) => {
                      return (
                        <div
                          className={clsx(
                            "w-28 text-[14px] flex items-center justify-center border gap-2 rounded-full cursor-pointer p-2",
                            {
                              "bg-overlay-border border-none":
                                !tokensSelected.includes(item.address),
                            },
                            {
                              "bg-overlay border-green-button shadow-[0_0px_10px] shadow-green-button":
                                tokensSelected.includes(item.address),
                            },
                          )}
                          onClick={() => {
                            if (tokensSelected.includes(item.address)) {
                              setTokensSelected((prev) =>
                                prev.filter(
                                  (itemNew) => item.address !== itemNew,
                                ),
                              );
                            } else {
                              setTokensSelected((prev) => {
                                const newArray = [];
                                prev.forEach((item2) => newArray.push(item2));
                                newArray.push(item.address);
                                return newArray;
                              });
                            }
                          }}
                        >
                          <img src={item.logo} className="w-6 h-6" alt="" />
                          <h2 className="text-white text-md font-bold">
                            {item.name}
                          </h2>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              <div className="py-6">
                <div className="text-primary text-[12px] text-center flex flex-col items-center justify-center">
                  {message ===
                  "You will have to make two transactions (if you haven't approved us before, instead you will get one). The first one to approve us to have listed your tokens and the second one to list the tokens" ? (
                    <span className="text-left w-full">
                      <span className="font-bold">Note:</span> {message}
                    </span>
                  ) : (
                    <>
                      <span className="flex gap-4 items-center justify-center">
                        {message} <LoadingOutlined />
                      </span>
                      <span className="flex gap-4 mt-6 items-center justify-center">
                        {message === "Listing your tokens" &&
                          "Last Transaction"}
                        {message === "Allowing us to sell your tokens" &&
                          "Transaction 1/2"}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Button
                decoration="fill"
                className="md:w-48 w-32 md:text-lg text-md py-[6px] rounded-lg text-overlay !bg-green-button hover:!bg-secondary hover:!text-green-button hover:!border-green-button"
                onClick={sellNft}
              >
                Sell Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RentPanel = ({ id, blockchain, show, NFTs, setState }) => {
  const {
    user: { ethAddress: user, provider },
  } = useUser();

  const dispatch = useAppDispatch();

  const cards = convertArrayCards();

  const { updateBlockchain } = useBlockchain();

  const [message, setMessage] = React.useState(
    "You will have to make two transactions (if you haven't approved us before, instead you will get one). The first one to approve us to have listed your tokens and the second one to list the tokens",
  );

  const [tokensSelected, setTokensSelected] = React.useState([]);

  const [sellNFTData, setSellNFTData] = React.useState({
    pricePerDay: 0,
    amount: 0,
  });

  React.useEffect(() => {
    setTokensSelected(getTokensAllowed(blockchain).map((item) => item.address));
  }, []);

  const tokensAllowed = getTokensAllowed(blockchain);

  const listNFTtoRent = async () => {
    if (sellNFTData.amount > NFTs.balanceCards[id].balance) {
      return alert("You don't have enough tokens to sell");
    }
    if (sellNFTData.pricePerDay <= 0) {
      return alert("You have to put a valid price per day");
    }

    if (tokensSelected.length == 0) {
      return alert("You have to put at least one currency to accept");
    }
    try {
      const changed = await switchChain(CHAIN_IDS_BY_NAME[blockchain]);
      if (!changed) {
        throw Error(
          "An error has occurred while switching chain, please try again.",
        );
      }
      updateBlockchain(blockchain);
      const tokenId = id;
      const { endersGate, rent } = getAddresses(blockchain);
      const endersgateInstance = getContractCustom(
        "EndersGate",
        endersGate,
        provider,
      );

      if (getNativeBlockchain(blockchain)) {
        const isApprovedForAll = await endersgateInstance.methods
          .isApprovedForAll(user, rent)
          .call();
        if (isApprovedForAll === false) {
          setMessage("Allowing us to list your tokens");
          await approveERC1155({
            provider: provider,
            from: user,
            to: rent,
            address: endersGate,
          });
        }
        setMessage("Listing your tokens");

        await dispatch(
          listRentERC1155Native({
            address: endersGate,
            from: user,
            pricePerDay: Web3.utils
              .toWei(sellNFTData.pricePerDay.toString(), "ether")
              .toString(),
            tokenId: tokenId,
            provider: provider,
            blockchain,
          }),
        );
      } else {
        const isApprovedForAll = await endersgateInstance.methods
          .isApprovedForAll(user, rent)
          .call();
        if (isApprovedForAll === false) {
          setMessage("Allowing us to sell your tokens");
          await approveERC1155({
            provider: provider,
            from: user,
            to: rent,
            address: endersGate,
          });
        }
        setMessage("Listing your tokens");

        const tx = await dispatch(
          listRentERC1155({
            address: endersGate,
            from: user,
            pricePerDay: (sellNFTData.pricePerDay * 10 ** 6).toString(),
            tokenId: tokenId,
            tokens: tokensSelected,
            provider: provider,
            blockchain,
          }),
        );
        if (!tx.payload) {
          throw Error(
            "An error occurred while listing your NFT, please try again",
          );
        }
      }
      show();
      dispatch(onLoadSales());
      dispatch(onGetAssets({ address: user, blockchain }));

      setState("choose");
      setSellNFTData({
        pricePerDay: 0,
        amount: 0,
      });
    } catch (err) {
      console.log({ err });
      toast.error(err.message);
    }
    setMessage(
      "You will have to make two transactions (if you haven't approved us before, instead you will get one). The first one to approve us to have listed your tokens and the second one to list the tokens",
    );
  };

  return (
    <div className="flex flex-col  w-full">
      <div className="flex flex-col">
        <div className="flex flex-col px-6 py-10  border border-overlay-border bg-secondary rounded-xl mt-4 relative">
          <ChevronLeftIcon
            onClick={() => setState("choose")}
            className="absolute md:top-3 left-2 top-2 text-overlay-border text-sm w-6 text-white cursor-pointer"
          />
          <div className="absolute md:top-3 right-2 top-2">
            <ChainSelect />
          </div>

          <p className="absolute md:bottom-3 md:right-4 bottom-2 right-4 text-overlay-border text-[10px]">
            RENT PANEL
          </p>

          <div className="flex flex-row xl:gap-32 gap-16 w-full">
            <div className="flex flex-col gap-4 w-full items-center sm:px-8">
              <div className="flex gap-4 w-full justify-between items-center">
                <label className="text-primary font-bold whitespace-nowrap">
                  Price per Day Rented (
                  {getNativeBlockchain(blockchain)
                    ? CHAINS[CHAIN_IDS_BY_NAME[blockchain]].nativeCurrency
                        ?.symbol
                    : "USD"}
                  )
                </label>
                <input
                  type="number"
                  className="bg-overlay text-primary text-center w-16 p-1 font-bold rounded-xl border border-overlay-border"
                  value={sellNFTData.pricePerDay}
                  min={0}
                  onChange={(e) => {
                    setSellNFTData((prev: any) => {
                      return {
                        ...prev,
                        pricePerDay: e.target.value,
                      };
                    });
                  }}
                />
              </div>
              <div className="flex gap-4 w-full justify-center items-center">
                <Typography type="subTitle" className="text-green-button">
                  Your are listing 1 {cards[id]?.properties?.name?.value} NFT
                  for Rent
                </Typography>
              </div>

              {getNativeBlockchain(blockchain) ? (
                ""
              ) : (
                <>
                  {" "}
                  <div className="text-[11px] w-full text-left text-white font-bold">
                    Select at least 1 currency you want to accept as a payment
                    for this listing
                  </div>
                  <div className="flex  gap-4 w-full flex-wrap items-center justify-center">
                    {tokensAllowed.map((item, index) => {
                      return (
                        <div
                          className={clsx(
                            "w-28 text-[14px] flex items-center justify-center border gap-2 rounded-full cursor-pointer p-2",
                            {
                              "bg-overlay-border border-none":
                                !tokensSelected.includes(item.address),
                            },
                            {
                              "bg-overlay border-green-button shadow-[0_0px_10px] shadow-green-button":
                                tokensSelected.includes(item.address),
                            },
                          )}
                          onClick={() => {
                            if (tokensSelected.includes(item.address)) {
                              setTokensSelected((prev) =>
                                prev.filter(
                                  (itemNew) => item.address !== itemNew,
                                ),
                              );
                            } else {
                              setTokensSelected((prev) => {
                                const newArray = [];
                                prev.forEach((item2) => newArray.push(item2));
                                newArray.push(item.address);
                                return newArray;
                              });
                            }
                          }}
                        >
                          <img src={item.logo} className="w-6 h-6" alt="" />
                          <h2 className="text-white text-md font-bold">
                            {item.name}
                          </h2>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              <div className="py-6">
                <div className="text-primary text-[12px] text-center flex flex-col items-center justify-center">
                  {message ===
                  "You will have to make two transactions (if you haven't approved us before, instead you will get one). The first one to approve us to have listed your tokens and the second one to list the tokens" ? (
                    <span className="text-left w-full">
                      <span className="font-bold">Note:</span> {message}
                    </span>
                  ) : (
                    <>
                      <span className="flex gap-4 items-center justify-center">
                        {message} <LoadingOutlined />
                      </span>
                      <span className="flex gap-4 mt-6 items-center justify-center">
                        {message === "Listing your tokens" &&
                          "Last Transaction"}
                        {message === "Allowing us to sell your tokens" &&
                          "Transaction 1/2"}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Button
                decoration="fill"
                className="md:w-48 w-32 md:text-lg text-md py-[6px] rounded-lg text-overlay !bg-green-button hover:!bg-secondary hover:!text-green-button hover:!border-green-button"
                onClick={listNFTtoRent}
              >
                List Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TokenInfo = ({ id, blockchain, NFTs, endersGate }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4 py-2 border border-overlay-border bg-secondary rounded-xl relative">
        <p className="absolute top-2 right-4 text-overlay-border text-[11px]">
          TOKEN INFO
        </p>
        <div className="flex flex-col w-full">
          <h2 className="text-white font-bold text-lg border-b border-overlay-border pb-2 sm:px-6 px-2">
            Token Details:
          </h2>
          <div className="w-full flex justify-between py-2 border-b border-overlay-border sm:px-6 px-2">
            <p className="text-lg font-[400] text-primary-disabled ">
              Blockchain:
            </p>
            <p className="text-primary-disabled  font-[400] text-lg">
              {CHAINS[CHAIN_IDS_BY_NAME[blockchain]]?.name}
            </p>
          </div>
          <div className="w-full flex justify-between py-2 border-b border-overlay-border sm:px-6 px-2">
            <p className="text-lg font-[400] text-primary-disabled ">
              Token ID:
            </p>
            <p className="text-primary-disabled  font-[400] text-lg">{id}</p>
          </div>
          <div className="w-full flex justify-between py-2 border-b border-overlay-border sm:px-6 px-2">
            <p className="text-lg font-[400] text-primary-disabled ">
              Balance:
            </p>
            <p className="text-primary-disabled  font-[400] text-lg">
              {NFTs.balanceCards[id]?.balance}
            </p>
          </div>
          <div className="w-full flex justify-between py-2 border-b border-overlay-border sm:px-6 px-2">
            <p className="text-lg font-[400] text-primary-disabled ">
              Balance Wrapped (Rented):
            </p>
            <p className="text-primary-disabled  font-[400] text-lg">
              {NFTs.balanceWrapped[id]?.balance}
            </p>
          </div>
          <div className="w-full flex justify-between py-2 border-b border-overlay-border sm:px-6 px-2">
            <p className="text-lg font-[400] text-primary-disabled ">
              Token Standard:
            </p>
            <p className="text-primary-disabled  font-[400] text-lg">ERC1155</p>
          </div>
          <div className="w-full flex justify-between py-2 border-b border-overlay-border sm:px-6 px-2">
            <p className="text-lg font-[400] text-primary-disabled ">
              Contract:
            </p>
            <a
              href={
                CHAINS[CHAIN_IDS_BY_NAME[blockchain]]?.blockExplorer +
                "/address/" +
                endersGate
              }
              target="_blank"
              rel="noreferrer"
              className="text-red-primary font-[400] text-lg flex items-center gap-1"
            >
              <AddressText text={endersGate}></AddressText>{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
          </div>
          <div className="w-full flex justify-between py-2 border-b border-overlay-border sm:px-6 px-2">
            <p className="text-lg font-[400] text-primary-disabled ">
              Partner Royalty:
            </p>
            <p className="text-primary-disabled font-[400] text-lg">0%</p>
          </div>
          <div className="w-full flex justify-between pt-2 sm:px-6 px-2">
            <p className="text-lg font-[400] text-primary-disabled ">
              5HG Fee:
            </p>
            <p className="text-primary-disabled font-[400] text-lg">4%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetailIDComponent;
