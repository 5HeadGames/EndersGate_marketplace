/* eslint-disable react/jsx-no-undef */
import React from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  editCartComics,
  removeAll,
  removeAllComics,
  removeFromCartComics,
} from "@redux/actions";
import Web3 from "web3";
import clsx from "clsx";
import comic from "../../../comics.json";

import { XIcon } from "@heroicons/react/solid";
import {
  getAddressesEth,
  getContractCustom,
  getTokensAllowed,
  getTokensAllowedEth,
  switchChain,
} from "@shared/web3";
import { findSum, nFormatter } from "../../common/specialFields/SpecialFields";
import { getDatabase, ref, set } from "firebase/database";
import { toast } from "react-hot-toast";
import useMagicLink from "@shared/hooks/useMagicLink";
import { LoadingOutlined } from "@ant-design/icons";
import { Button } from "@shared/components/common/button";
import { Image } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

export const Modals = ({
  priceUSD,
  priceMatic,
  setComicsOwned,
  ModalAddress,
  getPriceMatic,
  Modal,
  hide,
  hideAddress,
  preBuy,
  setPreBuy,
  dataAddress,
  showAddress,
  isShow,
}) => {
  const { ethAddress: account } = useSelector(
    (state: any) => state.layout.user,
  );

  const [tokenSelected, setTokenSelected] = React.useState("");
  const [messageBuy, setMessageBuy] = React.useState("");
  const [congrats, setCongrats] = React.useState(false);

  const tokensAllowed = getTokensAllowedEth();

  const { networkEth, providerEth, provider, cartComics } = useSelector(
    (state: any) => state.layout,
  );

  const { comics: comicsAddress, MATICUSD } = getAddressesEth();

  const db = getDatabase();

  const dispatch = useDispatch();

  const getComicsNFTs = async () => {
    const comics = getContractCustom("Comics", comicsAddress, providerEth);
    const nftsId = await comics.methods.comicIdCounter().call();
    const balances = await comics.methods
      .balanceOfBatch(
        new Array(parseInt(nftsId)).fill(account),
        new Array(parseInt(nftsId)).fill(1).map((i, id) => id + 1),
      )
      .call();

    setComicsOwned(
      balances.map((i, id) => {
        return { id: id + 1, balance: parseInt(i) };
      }),
    );
  };

  const buyComics = async () => {
    try {
      const changed = await switchChain(networkEth);
      if (!changed) {
        throw new Error(
          "An error occurred while changing the network, please try again.",
        );
      }
      updateBlockchain(networkEth);

      const comics = getContractCustom("Comics", comicsAddress, provider);
      if (tokenSelected === "") {
        return;
      }
      setMessageBuy(`Processing your purchase...`);
      const { ids, amounts, token } = {
        ids: cartComics.map((item) => item.idNFT),
        amounts: cartComics.map((item) => item.quantity.toString()),
        token: tokenSelected,
      };

      let price = "0";
      const ERC20 = getContractCustom("ERC20", token, providerEth);
      const addressesAllowed = getTokensAllowed();
      if (
        tokenSelected ===
        addressesAllowed.filter((item) => item.name === "MATIC")[0].address
      ) {
        const Aggregator = getContractCustom(
          "Aggregator",
          MATICUSD,
          providerEth,
        );

        const priceMATIC = await Aggregator.methods.latestAnswer().call();
        const preprice =
          (parseFloat(
            cartComics
              ?.map((item, i) => {
                return (parseInt(item.priceUSD) / 10 ** 6) * item.quantity;
              })
              .reduce((item, acc) => {
                return item + acc;
              }),
          ) *
            10 ** 8) /
          priceMATIC;

        price = Web3.utils.toWei(
          (preprice + preprice * 0.00005).toFixed(10).toString(),
          "ether",
        );

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
          setMessageBuy("Buying your NFT(s)");
          await comics.methods
            .buyBatch(account, ids, amounts, token)

            .send({ from: account });
        }
      }
      set(ref(db, "comics/" + account), dataAddress);
      setPreBuy(true);
      await getComicsNFTs();
      hideAddress();
      dispatch(removeAllComics());
      setCongrats(true);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setMessageBuy(``);
  };

  React.useEffect(() => {
    setTokenSelected(tokensAllowed[0].address);
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
        {!congrats ? (
          <Congrats hide={hide} />
        ) : (
          <CartComic
            {...{
              hide,
              cart: cartComics,
              tokensAllowed,
              tokenSelected,
              setTokenSelected,
              priceMatic,
              isMatic: true,
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
  priceMatic,
  isMatic,
  buy,
  messageBuy,
}) => {
  const dispatch = useDispatch();
  const { providerName } = useSelector((state: any) => state.layout.user);

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
                  dispatch(removeAll());
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
            <div className="flex gap-6 justify-between w-full text-md text-xl py-2 px-8 border-y border-transparent-color-gray-200 bg-transparent">
              <div className="flex gap-1 items-center">
                <h3 className="text-sm  text-white font-[700]">Total price:</h3>
              </div>
              <div className="flex flex-col gap items-end">
                {tokensAllowed.filter(
                  (item: any) => item.name === "MATIC" || item.name === "ETH",
                ).length > 0 && (
                  <h3
                    className="text-sm font-[700] text-white flex gap-1 items-center justify-center"
                    style={{ fontSize: "14px" }}
                  >
                    {priceMatic} {isMatic ? "MATIC" : "ETH"}{" "}
                    <img
                      src={
                        isMatic
                          ? "icons/polygon-matic-logo.png"
                          : "icons/eth.png"
                      }
                      className="w-3 h-3"
                      alt=""
                    />
                  </h3>
                )}
                <h3
                  className="text-sm font-[700] text-white opacity-50"
                  style={{ fontSize: "14px" }}
                >
                  ($
                  {parseInt(
                    cart
                      ?.map((item: any, i: any) =>
                        (parseInt(item.priceUSD) * item.quantity).toString(),
                      )
                      .reduce((item: any, acc: any) => {
                        return findSum(item, acc);
                      }),
                  ) /
                    10 ** 6}
                  )
                </h3>
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

const Congrats = ({ hide }) => {
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
            hide();
            router.push("/comics#my_comics");
          }}
        />
      </div>
    </div>
  );
};
