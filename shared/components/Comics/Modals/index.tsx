/* eslint-disable react/jsx-no-undef */
"use client";
import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { onLoadComics, removeAllComics } from "@redux/actions";
import Web3 from "web3";
import clsx from "clsx";

import { XIcon } from "@heroicons/react/solid";
import {
  getAddresses,
  getContract,
  getNativeBlockchain,
  getTokensAllowed,
  getContractCustom,
  onlyAcceptsERC20,
  hasAggregatorFeed,
} from "@shared/web3";
import { findSum } from "../../common/specialFields/SpecialFields";
import { getDatabase, ref, set } from "firebase/database";
import { toast } from "react-hot-toast";
import useMagicLink from "@shared/hooks/useMagicLink";
import { LoadingOutlined } from "@ant-design/icons";
import { Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useBlockchain } from "@shared/context/useBlockchain";
import { useUser } from "@shared/context/useUser";

export const Modals = ({
  priceNative,
  setComicsOwned,
  ModalAddress,
  Modal,
  hide,
  hideAddress,
  preBuy,
  setPreBuy,
  dataAddress,
  showAddress,
  isShow,
}) => {
  const {
    user: { ethAddress: account },
  } = useUser();

  const [tokenSelected, setTokenSelected] = React.useState("");
  const [messageBuy, setMessageBuy] = React.useState("");
  const [congrats, setCongrats] = React.useState(false);

  const { blockchain, updateBlockchain } = useBlockchain();

  const tokensAllowed = getTokensAllowed(blockchain);

  const { cartComics, provider } = useSelector((state: any) => state.layout);

  const { comics: comicsAddress, NATIVEUSD } = getAddresses(blockchain);

  const db = getDatabase();

  const dispatch = useDispatch();

  const getComicsNFTs = async () => {
    const comics = getContract(
      getNativeBlockchain(blockchain)
        ? "ComicsNative"
        : onlyAcceptsERC20(blockchain)
        ? "ComicsOnlyMultiToken"
        : "Comics",
      comicsAddress,
      blockchain,
    );
    const nftsId = await comics.methods.comicIdCounter().call();
    const balances = await comics.methods
      .balanceOfBatch(
        new Array(parseInt(nftsId)).fill(account),
        new Array(parseInt(nftsId)).fill(1).map((i, id) => id + 1),
      )
      .call();

    // dispatch(onLoadComics());

    setComicsOwned(
      balances.map((i, id) => {
        return { id: id + 1, balance: parseInt(i) };
      }),
    );
  };

  const buyComics = async () => {
    try {
      updateBlockchain(blockchain);
      const comics = getContractCustom(
        getNativeBlockchain(blockchain)
          ? "ComicsNative"
          : onlyAcceptsERC20(blockchain)
          ? "ComicsOnlyMultiToken"
          : "Comics",
        comicsAddress,
        provider,
      );

      setMessageBuy(`Processing your purchase...`);
      const { ids, amounts, token } = {
        ids: cartComics.map((item) => item.idNFT.toString()),
        amounts: cartComics.map((item) => item.quantity.toString()),
        token: tokenSelected,
      };

      let price = "0";
      if (!getNativeBlockchain(blockchain)) {
        const ERC20 = getContractCustom("ERC20", token, provider);
        const addressesAllowed = getTokensAllowed(blockchain);
        if (tokenSelected === "") return;
        if (
          tokenSelected === addressesAllowed[0]?.address &&
          hasAggregatorFeed(blockchain)
        ) {
          const Aggregator = getContract("Aggregator", NATIVEUSD, blockchain);

          const priceMATIC = await Aggregator.methods.latestAnswer().call();

          const preprice =
            (parseFloat(
              cartComics
                ?.map((item) => {
                  return (parseInt(item.price) / 10 ** 6) * item.quantity;
                })
                ?.reduce((item: any, acc) => {
                  return item + acc;
                }),
            ) *
              10 ** 8) /
            priceMATIC;

          price = Web3.utils.toWei(preprice.toString(), "ether");

          await comics.methods
            .buyBatch(account, ids, amounts, token)
            .send({ from: account, value: price });
        } else {
          const allowance = await ERC20.methods
            .allowance(account, comicsAddress)
            .call();

          if (allowance < 1000000000000) {
            setMessageBuy(
              `Increasing the allowance of ${
                tokensAllowed.filter((item) => item.address == tokenSelected)[0]
                  .name
              } 1/2`,
            );
            await ERC20.methods
              .increaseAllowance(
                comicsAddress,
                "1000000000000000000000000000000000000000000000000",
              )
              .send({
                from: account,
              });
            setMessageBuy("Buying your NFT(s) 2/2");
            await comics.methods
              .buyBatch(account, ids, amounts, token)

              .send({ from: account });
          } else {
            setMessageBuy("Buying your NFT(s). ");
            await comics.methods
              .buyBatch(account, ids, amounts, token)

              .send({ from: account });
          }
        }
      } else {
        price = cartComics
          ?.map((item: any, i) => {
            return BigInt(item.price) * BigInt(item.quantity);
          })
          .reduce((item: any, acc) => {
            return BigInt(item) + BigInt(acc);
          });
        await comics.methods
          .buyBatch(account, ids, amounts)
          .send({ from: account, value: price.toString() });
      }
      set(ref(db, "comics/" + account), dataAddress);
      setPreBuy(true);
      await getComicsNFTs();
      dispatch(removeAllComics());
      hideAddress();
      setCongrats(true);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setMessageBuy(``);
  };

  React.useEffect(() => {
    if (tokensAllowed) {
      setTokenSelected(tokensAllowed[0].address);
    }
  }, [tokensAllowed]);

  return (
    <>
      {ModalAddress}
      <Modal
        noClose
        withoutX
        isShow={isShow}
        onClose={() => {
          setPreBuy(true);
        }}
      >
        {congrats ? (
          <Congrats hide={hide} setCongrats={setCongrats} />
        ) : (
          <CartComic
            {...{
              hide,
              cart: cartComics,
              tokensAllowed,
              tokenSelected,
              setTokenSelected,
              priceNative,
              buy: preBuy
                ? () => {
                    hide();
                    setTimeout(() => {
                      showAddress();
                    }, 1000);
                  }
                : buyComics,
              messageBuy,
            }}
          />
        )}
      </Modal>
    </>
  );
};

const CartComic = ({
  hide,
  cart,
  tokensAllowed,
  tokenSelected,
  setTokenSelected,
  priceNative,
  buy,
  messageBuy,
}) => {
  const dispatch = useDispatch();
  const {
    user: { providerName },
  } = useUser();
  const { blockchain } = useBlockchain();

  const { showWallet } = useMagicLink();
  return (
    <div className="inline-block align-bottom text-left rounded-20 shadow-md transform transition-all sm:align-middle w-max sm:max-w-6xl">
      <div className="flex flex-col gap-4  bg-overlay p-4 rounded-xl border border-transparent-color-gray-200 relative shadow-inner mt-24">
        <div className="text-white absolute top-2 right-2">
          <XIcon onClick={hide} className="w-6 h-6 cursor-pointer"></XIcon>
        </div>
        <div className="text-center text-xl font-bold text-white">
          Your cart
        </div>
        {cart.length ? (
          <div className="flex flex-col items-center border border-transparent-color-gray-200 rounded-xl md:min-w-[500px] md:w-max py-2">
            <div className="flex justify-between gap-4 w-full">
              <h2 className="text-lg font-bold text-white opacity-[0.5] py-4 px-4">
                {cart
                  .map((item: any) => item.quantity)
                  .reduce((acc: any, red: any) => acc + red)}{" "}
                Item
                {cart
                  .map((item: any) => item.quantity)
                  .reduce((acc: any, red: any) => acc + red) > 1
                  ? "s"
                  : ""}
              </h2>{" "}
              <h2
                className="text-sm font-bold text-white py-4 px-4 cursor-pointer"
                onClick={() => {
                  dispatch(removeAllComics());
                }}
              >
                Clear all
              </h2>
            </div>
            <div className="px-2 pb-4">
              <div className="gap-2 flex items-center justify-center w-full rounded-xl border border-overlay-border p-4">
                <div className="flex flex-col items-center justify-center gap-2 w-[210px]">
                  <h2 className="text-white font-bold text-center">
                    {cart[0]?.name}
                  </h2>
                  <img
                    src="https://bafybeicvxsksypr4z6bkwey2dbtmzmm7dmu2eienae5zl25r6nb5u64kuu.ipfs.nftstorage.link/HVO_COVER.webp"
                    alt=""
                    className="w-[200px]"
                  />
                </div>
                <img src="/icons/plus.svg" alt="" />
                <div className="flex flex-col items-center justify-center gap-2 w-[210px]">
                  <h2 className="text-white font-bold text-center">
                    {cart[1]?.name}
                  </h2>
                  <img
                    src="/images/HvOIssue_2.webp"
                    alt=""
                    className="w-[200px]"
                  />
                </div>
              </div>
            </div>
            {getNativeBlockchain(blockchain) === false ? (
              <>
                <div className="text-md text-white font-bold w-full text-center">
                  Chose currency
                </div>
                <div className="flex  gap-4 pb-4 w-full flex-wrap items-center justify-center shadow-inner">
                  {tokensAllowed.map((item: any, index: any) => {
                    return (
                      <div
                        className={clsx(
                          "w-24 flex items-center justify-center gap-1 rounded-xl cursor-pointer py-1 border border-white",

                          {
                            "bg-transparent-color-gray-200 border-none":
                              tokenSelected !== item.address,
                          },
                          {
                            "bg-overlay border-green-button shadow-[0_0px_10px] shadow-green-button":
                              tokenSelected === item.address,
                          },
                        )}
                        onClick={() => {
                          setTokenSelected(item.address);
                        }}
                      >
                        <img src={item.logo} className="w-6 h-6" alt="" />
                        <h2 className="text-white text-sm font-bold">
                          {item.name}
                        </h2>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              ""
            )}
            <div className="flex gap-6 justify-between w-full text-md text-xl py-2 px-8 border-y border-transparent-color-gray-200 bg-transparent">
              <div className="flex gap-1 items-center">
                <h3 className="text-sm  text-white font-[700]">Total price:</h3>
              </div>
              <div className="flex flex-col gap items-end">
                <h3
                  className="text-sm font-[700] text-white flex gap-1 items-center justify-center"
                  style={{ fontSize: "14px" }}
                >
                  {priceNative}
                  <img
                    src={
                      `images/${blockchain}.png`
                      // :"icons/eth.png"
                    }
                    className="w-3 h-3"
                    alt=""
                  />
                </h3>
                {!getNativeBlockchain(blockchain) && (
                  <h3
                    className="text-sm font-[700] text-white opacity-50"
                    style={{ fontSize: "14px" }}
                  >
                    ($
                    {parseInt(
                      cart
                        ?.map((item: any, i: any) =>
                          (parseInt(item.price) * item.quantity).toString(),
                        )
                        .reduce((item: any, acc: any) => {
                          return findSum(item, acc);
                        }),
                    ) /
                      10 ** 6}
                    )
                  </h3>
                )}
              </div>
            </div>

            {messageBuy !== "" ? (
              <div className="absolute m-auto top-0 bottom-0 left-0 right-0 w-full h-full flex items-center justify-center bg-[#000000aa]">
                <div className="flex flex-col items-center justify-center gap-2 text-4xl text-white font-bold text-center p-2 rounded-xl bg-overlay-3 w-min border border-overlay-border">
                  <span className="whitespace-nowrap text-lg">
                    {messageBuy}
                  </span>{" "}
                  <LoadingOutlined />
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="w-full flex items-center justify-center py-2">
              <div
                onClick={() => {
                  buy();
                }}
                className="w-auto px-6 py-2 flex justify-center items-center rounded-xl hover:border-green-button hover:bg-overlay hover:text-green-button border border-transparent-color-gray-200 cursor-pointer bg-green-button font-bold text-overlay transition-all duration-500"
              >
                Checkout
              </div>
            </div>
            {providerName === "magic" && (
              <div
                className="text-[12px] text-green-button pt-4 font-bold flex items-center justify-center gap-2 cursor-pointer"
                onClick={() => {
                  showWallet();
                }}
              >
                <img src="icons/wallet.png" className="w-8 pb-2" alt="" /> Add
                funds to your wallet
              </div>
            )}
            {blockchain == "findora" && (
              <div
                className="text-[12px] text-green-button pt-4 font-bold flex items-center justify-center gap-2 cursor-pointer"
                onClick={() => {
                  showWallet();
                }}
              >
                <img src="icons/wallet.png" className="w-8 pb-2" alt="" /> Add
                funds to your wallet
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white font-bold gap-4 text-md text-center w-64 p-4 border border-transparent-color-gray-200 rounded-xl">
            <img src={"icons/logo.png"} className="w-20 h-20" alt="" />
            There aren't items in your cart.
          </div>
        )}
      </div>
    </div>
  );
};

const Congrats = ({ hide, setCongrats }) => {
  const router = useRouter();

  return (
    <div
      style={{ width: "90vw", maxWidth: "375px" }}
      className="relative bg-overlay flex flex-col items-center gap-4 jusify-center shadow-2xl rounded-2xl mt-36"
    >
      <Image
        src="/images/comicsbg.png"
        className="w-full opacity-25 absolute top-0"
        alt=""
      />
      <Image
        src="/images/comics.svg"
        className="absolute"
        width={"275px"}
        top={"-175px"}
        alt=""
      />
      <div className="absolute h-full w-full rounded-2xl bg-gradient-to-b from-transparent to-overlay px-2 from-0% to-30% "></div>
      <div className="absolute top-2 right-2 flex justify-end w-full py-2">
        <XIcon
          className="text-white w-5 cursor-pointer p-[2px] rounded-full bg-overlay border border-white"
          onClick={() => {
            setCongrats(false);
            hide();
          }}
        />
      </div>
      <div className="flex flex-col items-center justify-center relative rounded-full px-6 pt-16 pb-8 gap-2">
        <h2 className="text-white text-center font-bold text-5xl text-red-alert">
          Success!
        </h2>{" "}
        <p className="text-center text-white text-lg py-4">
          You have just joined the Enders Gate waitlist to mint Issues 1 & 2 of
          Humans vs Ogres comic books!
        </p>
        <p className="text-center text-white text-lg py-2">
          Share this with your friends and inform them about the waitlist!
        </p>
        <a
          href="https://twitter.com/intent/tweet?text=I'm so excited to announce that I just have minted Humans vs Ogres Issues 1 and 2 Comics from Enders Gate! Get yours on: https://marketplace.endersgate.gg/comics"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/images/share.png" className="h-12 cursor-pointer" alt="" />
        </a>
        <img
          src="/images/view_comics.png"
          className="h-12 cursor-pointer"
          alt=""
          onClick={() => {
            setCongrats(false);
            hide();
            router.push("/comics#my_comics");
          }}
        />
      </div>
    </div>
  );
};
