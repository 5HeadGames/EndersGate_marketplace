/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { LoadingOutlined, ShopOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { useRouter } from "next/router";
import {
  getAddresses,
  getContract,
  getContractCustom,
  getNativeBlockchain,
  getTokensAllowed,
  getTokensAllowedMatic,
  switchChain,
} from "@shared/web3";
import {
  addCartShop,
  editCartShop,
  buyFromShop,
  buyFromShopNative,
  onGetAssets,
  parseSaleNative,
  parseSaleTokens,
  removeAll,
  removeAllShop,
  removeFromCartShop,
} from "@redux/actions";
import { toast } from "react-hot-toast";
import { CHAIN_IDS_BY_NAME } from "@shared/components/chains";
import { useBlockchain } from "@shared/context/useBlockchain";
import { formatPrice } from "@shared/utils/formatPrice";
import { useCartModal } from "@shared/components/common/cartModal";
import { XIcon } from "@heroicons/react/solid";
import { useUser } from "@shared/context/useUser";

const Shop = () => {
  const {
    user: { ethAddress: account, provider },
  } = useUser();
  const [sales, setSales] = useState([]);
  const [counters, setCounters] = useState([1, 1, 1, 1]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [tokenSelected, setTokenSelected] = React.useState("");
  const [messageBuy, setMessageBuy] = React.useState("");
  const { addToast } = useToasts();
  const [priceNative, setPriceNative] = React.useState("0");

  const { blockchain, updateBlockchain } = useBlockchain();

  const tokensAllowed = getTokensAllowed(blockchain);

  const { Modal, show, isShow, hide } = useCartModal();

  const { cartShop } = useSelector((state: any) => state.layout);

  const { shop: shopAddress, MATICUSD } = getAddresses(blockchain);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (tokensAllowed) {
      setTokenSelected(tokensAllowed[0].address);
    }
  }, [tokensAllowed]);

  const packs = [
    {
      name: "Common Pack",
      imagePack: "./images/0.png",
      color: "#FFA6FF",
    },
    {
      name: "Rare Pack",
      imagePack: "./images/1.png",
      color: "#E9D880",
    },
    {
      name: "Epic Pack",
      imagePack: "./images/2.png",
      color: "#7FBADD",
    },
    {
      name: "Legendary Pack",
      imagePack: "./images/3.png",
      color: "#8AE98C",
    },
  ];

  const updateSales = async () => {
    setIsLoading(true);
    try {
      // Use web3 to get the user's accounts.
      const shop = getContract(
        !getNativeBlockchain(blockchain) ? "Shop" : "ShopFindora",
        shopAddress,
        blockchain,
      );

      const lastSale = Number(await shop.methods.tokenIdTracker().call());
      const rawSales = await shop.methods
        .getSales(new Array(lastSale).fill(0).map((a, i) => i))
        .call();

      const allSales = rawSales.map((sale, i) => {
        const saleFormatted = !getNativeBlockchain(blockchain)
          ? parseSaleTokens(sale)
          : parseSaleNative(sale);
        return {
          id: i,
          ...saleFormatted,
        };
      });
      const created = allSales
        .filter((sale) => sale.status === "0")
        .map((sale) => {
          return {
            ...sale,
            name: packs[sale.nftId]?.name,
            imagePack: packs[sale.nftId]?.imagePack,
            color: packs[sale.nftId]?.color,
            priceText: formatPrice(sale.price, blockchain),
          };
        });

      setSales(created);
      setCounters(created.map(() => 1));
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (blockchain) {
      try {
        switchChain(CHAIN_IDS_BY_NAME[blockchain]);
        updateSales();
        dispatch(removeAllShop());
      } catch (err) {
        toast.error(
          "An error occurred while changing the network, please try again.",
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockchain]);

  const buyPacks = async () => {
    try {
      const changed = await switchChain(CHAIN_IDS_BY_NAME[blockchain]);
      if (!changed) {
        return;
      }
      updateBlockchain(blockchain);

      if (tokenSelected === "") {
        addToast("Please Select a Payment Method", { appearance: "error" });
        return;
      }
      let tx;
      if (!getNativeBlockchain(blockchain)) {
        tx = await dispatch(
          buyFromShop({
            blockchain,
            account,
            tokenSelected,
            provider,
            setMessageBuy,
            cartShop,
          }),
        );
      } else {
        tx = await dispatch(
          buyFromShopNative({
            blockchain,
            account,
            tokenSelected,
            provider,
            setMessageBuy,
            cartShop,
          }),
        );
      }
      if (tx.err) {
        throw Error(tx.err.message);
      }
      dispatch(onGetAssets({ address: account, blockchain }));
      updateSales();
    } catch (error) {
      console.log(error);
    }
    setMessageBuy(``);
    hide();
    dispatch(removeAll());
  };

  const getPriceMatic = async () => {
    const Aggregator = getContractCustom("Aggregator", MATICUSD, provider);
    const priceMATIC = await Aggregator.methods.latestAnswer().call();
    const price =
      BigInt(
        cartShop
          ?.map((item, i) => {
            return (
              (BigInt(item.price) / BigInt(10 ** 6)) * BigInt(item.quantity)
            );
          })
          .reduce((item, acc) => {
            return BigInt(item) + BigInt(acc);
          }) * BigInt(10 ** 8),
      ) / BigInt(priceMATIC);
    console.log(price);
    setPriceNative((price + (price * BigInt(5)) / BigInt(100)).toString());
  };

  React.useEffect(() => {
    if (cartShop.length > 0 && !getNativeBlockchain(blockchain)) {
      getPriceMatic();
    } else {
      setPriceNative("0");
    }
  }, [cartShop]);

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center relative w-full h-screen overflow-hidden pt-28">
          <div className="absolute left-0 right-0 mx-auto top-0 z-0 flex w-full bgPackContainer">
            <img
              src="/images/shop_background.png"
              className="sm:block hidden w-screen h-screen"
              alt=""
            />
          </div>
          <div className="text-3xl text-white">
            <LoadingOutlined />
          </div>
        </div>
      )}
      {!isLoading && (
        <div
          className="w-full h-full relative overflow-hidden shop"
          style={{ minHeight: "100vh" }}
        >
          <Modal
            blockchain={blockchain}
            isShow={isShow}
            cart={cartShop}
            removeAll={removeAll}
            messageBuy={messageBuy}
            withoutX
            tokensAllowed={tokensAllowed}
            setTokenSelected={setTokenSelected}
            tokenSelected={tokenSelected}
            priceMatic={priceNative}
            buy={buyPacks}
            isMatic={!getNativeBlockchain(blockchain)}
            itemsCart={cartShop.map((item, index) => {
              return (
                <div
                  key={"pack-shop-" + item.nftId}
                  className={clsx(
                    "py-2 flex items-center justify-between gap-8 text-white cursor-pointer w-full px-2 border border-transparent-color-gray-200 rounded-xl",
                  )}
                  // onClick={item.onClick}
                >
                  <div className="flex items-center justify-start gap-2 w-full">
                    <div className="rounded-xl flex flex-col text-gray-100 relative overflow-hidden border border-gray-500 h-20 w-20">
                      <img
                        src={packs[item.nftId]?.imagePack}
                        className={`absolute top-[-40%] left-[-40%] right-0 m-auto min-w-[175%]`}
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className={clsx("text-md font-[700] uppercase")}>
                        {packs[item.nftId]?.name}
                      </h3>

                      <div className="flex gap-2 items-end">
                        <img
                          src={"icons/logo.png"}
                          className="w-8 h-8"
                          alt=""
                        />
                        <img
                          src="icons/POLYGON.svg"
                          className="w-6 h-6"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <div className="flex flex-col !shrink-0">
                      <h3
                        className={clsx(
                          "text-sm font-[700] whitespace-nowrap w-24",
                        )}
                      >
                        Price:
                      </h3>
                      <h3
                        className={clsx(
                          "text-sm font-[700] uppercase whitespace-nowrap w-24",
                        )}
                      >
                        {formatPrice(item.price, blockchain)}
                      </h3>
                    </div>
                    <input
                      defaultValue={item.quantity}
                      type="number"
                      min={1}
                      className="text-lg px-2 text-white w-12 bg-transparent rounded-xl border border-overlay-overlay"
                      onChange={(e) => {
                        dispatch(
                          editCartShop({
                            id: index,
                            item: { ...item, quantity: e.target.value },
                          }),
                        );
                      }}
                    ></input>
                    <div
                      className="rounded-full p-1 w-8 h-8 border border-transparent-color-gray-200 hover:bg-red-primary text-white shrink-0 cursor-pointer"
                      onClick={() => {
                        dispatch(removeFromCartShop({ id: item.id }));
                      }}
                    >
                      <XIcon />
                    </div>
                  </div>
                </div>
              );
            })}
          />

          <img
            src="/images/shop_background.png"
            className="flex absolute z-0 w-full h-full"
            alt=""
          />
          <div className="relative border-b border-white Poppins text-white text-4xl text-center font-black py-12 pt-24 w-full">
            NFT SHOP
          </div>

          <div className="flex xl:flex-row flex-col xl:justify-between xl:items-end items-center relative w-full pt-6">
            <div className="flex w-full items-center justify-center gap-2">
              <div className="relative md:w-64 sm:w-40 w-24">
                <div className="absolute flex shrink-0 items-center justify-center w-full h-full">
                  <h2 className="relative  sm:text-xl text-sm text-white">
                    NFT PACKS
                  </h2>
                </div>
                <img
                  src="./images/bgGold.png"
                  className="cursor-pointer"
                  alt=""
                />
              </div>
              <div className="relative md:w-64 sm:w-40 w-28">
                <div className="absolute flex shrink-0 items-center justify-center w-full h-full">
                  <h2 className="relative  sm:text-xl text-sm text-white">
                    AVATAR CARDS
                  </h2>
                </div>
                <img
                  src="./images/bgNonSelected.png"
                  className="cursor-pointer"
                  alt=""
                />
              </div>
              {/* <Link href="/comics"> */}
              <div className="relative md:w-64 sm:w-40 w-24">
                <div className="absolute flex shrink-0 items-center justify-center w-full h-full">
                  <h2 className="relative  sm:text-xl text-sm text-white">
                    EG COMICS
                  </h2>
                </div>
                <img
                  src="./images/bgNonSelected.png"
                  className="cursor-pointer"
                  alt=""
                />
              </div>
              {/* </Link> */}
              <div
                className="p-4 bg-overlay lg:flex hidden items-center justify-center text-white cursor-pointer z-10 relative"
                onClick={() => {
                  show();
                }}
              >
                <img
                  src="./images/bgGold.png"
                  className="cursor-pointer absolute w-full h-full"
                  alt=""
                />

                {cartShop.length > 0 && (
                  <div className="p-1 rounded-full flex items-center justify-center absolute top-1 left-1 bg-primary-disabled min-w-4 min-h-4 z-10">
                    <p
                      className="flex items-center justify-center w-4 h-4"
                      style={{ fontSize: "10px" }}
                    >
                      {cartShop
                        .map((item) => parseInt(item.quantity))
                        .reduce((acc, red) => acc + red)}
                    </p>
                  </div>
                )}

                <ShopOutlined className="text-2xl flex items-center justify-center relative" />
              </div>
            </div>
          </div>
          <div className="relative w-full flex md:flex-row flex-col md:items-start items-center bgPacksShop">
            <div
              className={clsx(
                sales.length > 0
                  ? "flex items-center justify-center flex-wrap h-full md:py-4 py-10 md:px-0 mx-4 w-full gap-2"
                  : "flex items-center justify-center w-full",
              )}
            >
              {sales.length > 0 ? (
                sales.map((sale, index) => {
                  return (
                    <div className="relative shadow-white">
                      <img
                        src="./images/box_pack.png"
                        className="absolute w-full h-full"
                        alt=""
                      />
                      <div className="flex flex-col items-center justify-center h-full py-6 px-4">
                        <div
                          className="relative flex items-center justify-center"
                          style={{
                            height: "40px",
                            width: "240px",
                            flexShrink: 0,
                          }}
                        >
                          <h2
                            className="Poppins uppercase text-xl text-center relative"
                            style={{ color: sale.color }}
                          >
                            {sale.name}
                          </h2>
                        </div>
                        <h2 className="Poppins uppercase text-md text-center text-white relative">
                          {sale.priceText}
                        </h2>
                        <img
                          src={sale.imagePack}
                          alt=""
                          style={{ flexShrink: 0 }}
                          className="relative pt-2 w-44"
                        />
                        <div
                          className="relative flex items-center justify-center my-2"
                          style={{
                            height: "40px",
                            width: "160px",
                            flexShrink: 0,
                          }}
                        >
                          <h2 className=" text-md text-center text-gray-200 relative">
                            {sale.amount} LEFT
                          </h2>
                        </div>
                        <div
                          className="relative flex items-center justify-center"
                          style={{
                            height: "40px",
                            width: "160px",
                            flexShrink: 0,
                          }}
                        >
                          <div
                            className={clsx(
                              // { ["hidden"]: index !== 0 },
                              "flex justify-between w-full px-2 relative shadow-white",
                            )}
                          >
                            <div className="flex gap-1">
                              <div
                                className="cursor-pointer text-xl text-white"
                                onClick={
                                  counters[index] > 1
                                    ? () => {
                                        setCounters((prev) => {
                                          const newArray = [];
                                          prev.forEach((previous, index2) => {
                                            if (index === index2) {
                                              newArray.push(previous - 1);
                                            } else {
                                              newArray.push(previous);
                                            }
                                          });
                                          return newArray;
                                        });
                                      }
                                    : undefined
                                }
                              >
                                -
                              </div>
                              <input
                                className="text-xl text-white text-center bg-transparent w-5 outline-none"
                                value={counters[index]}
                                type="number"
                                min={1}
                                max={10}
                                onChange={(e) => {
                                  if (e.target.value.length < 3) {
                                    setCounters((prev) => {
                                      const newArray = [];
                                      prev.forEach((previous, id) => {
                                        if (id === index) {
                                          newArray.push(e.target.value);
                                        } else {
                                          newArray.push(previous);
                                        }
                                      });
                                      return newArray;
                                    });
                                  }
                                }}
                              />

                              <div
                                className="cursor-pointer text-xl text-white"
                                onClick={
                                  counters[index] < 10
                                    ? () => {
                                        setCounters((prev) => {
                                          const newArray = [];
                                          prev.forEach((previous, index2) => {
                                            if (index === index2) {
                                              newArray.push(previous + 1);
                                            } else {
                                              newArray.push(previous);
                                            }
                                          });
                                          return newArray;
                                        });
                                      }
                                    : undefined
                                }
                              >
                                +
                              </div>
                            </div>
                            <div
                              className="text-xl text-white cursor-pointer"
                              onClick={() => {
                                if (account) {
                                  if (
                                    cartShop
                                      .map((item) => {
                                        return item.id;
                                      })
                                      .includes(sale.id)
                                  ) {
                                    dispatch(
                                      editCartShop({
                                        item: {
                                          ...sale,
                                          quantity: counters[index],
                                        },
                                        id: cartShop
                                          .map((item) => {
                                            return item.id;
                                          })
                                          .indexOf(sale.id),
                                      }),
                                    );
                                  } else {
                                    dispatch(
                                      addCartShop({
                                        ...sale,
                                        quantity: counters[index],
                                      }),
                                    );
                                  }
                                } else {
                                  router.push("/login");
                                }
                              }}
                            >
                              ADD
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-white text-xl py-40 w-full text-center relative">
                  There are not packs to buy now
                </div>
              )}
            </div>
          </div>
          <div className="sm:block hidden pt-56 w-full"></div>
          <div
            className="fixed bottom-4 right-4 p-4 rounded-full bg-overlay lg:hidden flex items-center justify-center hover:bg-primary  text-white cursor-pointer z-10"
            onClick={() => {
              show();
            }}
          >
            <div className="relative flex items-center justify-center p-2">
              {cartShop.length > 0 && (
                <p
                  className="px-1 rounded-full flex items-center justify-center absolute top-2 left-2 bg-primary w-2 h-2"
                  style={{ fontSize: "10px" }}
                >
                  {cartShop
                    .map((item) => parseInt(item.quantity))
                    .reduce((acc, red) => acc + red)}
                </p>
              )}
              <ShopOutlined className="text-xl" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Shop;
