/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { LoadingOutlined, ShopOutlined } from "@ant-design/icons";
import clsx from "clsx";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
import { nFormatter } from "@shared/components/common/specialFields/SpecialFields";
import { networkConfigs } from "@shared/components/helpers/networks";

import { XIcon } from "@heroicons/react/solid";
import { useCartModal } from "@shared/components/common/cartModal";
import { useToasts } from "react-toast-notifications";
import { useRouter } from "next/router";
import {
  getAddressesMatic,
  getContractCustom,
  getTokensAllowed,
  switchChain,
} from "@shared/web3";
import {
  addCartShop,
  editCart,
  editCartShop,
  removeAll,
  removeFromCart,
} from "@redux/actions";
import { toast } from "react-hot-toast";

const Shop = () => {
  const { ethAddress: account, provider } = useSelector(
    (state: any) => state.layout.user,
  );
  const [contract, setContract] = useState(null);
  const [sales, setSales] = useState([]);
  const [counters, setCounters] = useState([1, 1, 1, 1]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [tokenSelected, setTokenSelected] = React.useState("");
  const [messageBuy, setMessageBuy] = React.useState("");
  const { addToast } = useToasts();
  const [priceMatic, setPriceMatic] = React.useState("0");

  const tokensAllowed = getTokensAllowed();

  const { Modal, show, isShow, hide } = useCartModal();

  const { networkId } = useSelector((state: any) => state.layout.user);
  const { cartShop } = useSelector((state: any) => state.layout);

  const { shop: shopAddress, MATICUSD } = getAddressesMatic();

  const dispatch = useDispatch();

  React.useEffect(() => {
    setTokenSelected(tokensAllowed[0].address);
  }, [tokensAllowed]);

  const packs = [
    {
      name: "Common Pack",
      imagePack: "./images/0.png",
      quantity: "8000",
      price: "25 USD in MATIC Token",
      imageCoin: "./assets/shop/coins1.png",
      color: "#FFA6FF",
    },
    {
      name: "Rare Pack",
      imagePack: "./images/1.png",
      quantity: "6000",
      price: "50 USD in MATIC Token",
      imageCoin: "./assets/shop/coins2.png",
      color: "#E9D880",
    },
    {
      name: "Epic Pack",
      imagePack: "./images/2.png",
      quantity: "4000",
      price: "100 USD in MATIC Token",
      imageCoin: "./assets/shop/coins3.png",
      color: "#7FBADD",
    },
    {
      name: "Legendary Pack",
      imagePack: "./images/3.png",
      quantity: "2000",
      price: "200 USD in MATIC Token",
      imageCoin: "./assets/shop/coins4.png",
      color: "#8AE98C",
    },
  ];

  const updateSales = async () => {
    setIsLoading(true);
    try {
      // Use web3 to get the user's accounts.
      const web3 = new Web3(networkConfigs[networkId].rpc);
      const shop = getContractCustom("Shop", shopAddress, web3.currentProvider);
      const lastSale = Number(await shop.methods.tokenIdTracker().call());
      const rawSales = await shop.methods
        .getSales(new Array(lastSale).fill(0).map((a, i) => i))
        .call();
      const allSales = rawSales.map((sale, i) => ({
        id: i,
        seller: sale[0],
        nft: sale[1],
        nftId: sale[2],
        amount: sale[3],
        priceUSD: sale[4],
        tokens: sale[5],
        duration: sale[6],
        startedAt: sale[7],
        status: sale[8],
      }));
      const created = allSales
        .filter((sale) => sale.status === "0")
        .map((sale) => {
          return {
            ...sale,
            name: packs[sale.nftId]?.name,
            imagePack: packs[sale.nftId]?.imagePack,
            imageCoin: packs[sale.nftId]?.imageCoin,
            color: packs[sale.nftId]?.color,
            price: packs[sale.nftId]?.price,
          };
        });
      setSales(created);
      setCounters(created.map(() => 1));
      // Update State
      setContract(contract);
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
    if (networkId) {
      try {
        switchChain(networkId);
        updateSales();
      } catch (err) {
        toast.error(
          "An error occurred while changing the network, please try again.",
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkId]);

  const buyPacks = async () => {
    try {
      const changed = await switchChain(networkId);
      if (!changed) {
        throw new Error(
          "An error occurred while changing the network, please try again.",
        );
      }

      const shop = await getContractCustom("Shop", shopAddress, provider);

      if (tokenSelected === "") {
        addToast("Please Select a Payment Method", { appearance: "error" });
        return;
      }

      setMessageBuy(`Processing your purchase...`);

      const { amounts, token, tokensId } = {
        amounts: cartShop.map((item) => item.quantity),
        token: tokenSelected,
        tokensId: cartShop.map((item) => item.id),
      };

      let price = "0";
      const ERC20 = getContractCustom("ERC20", token, provider);
      const addressesAllowed = getTokensAllowed();
      if (
        tokenSelected ===
        addressesAllowed.filter((item) => item.name === "MATIC")[0].address
      ) {
        const Aggregator = getContractCustom("Aggregator", MATICUSD, provider);
        const priceMATIC = await Aggregator.methods.latestAnswer().call();
        const preprice =
          (parseFloat(
            cartShop
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
          (preprice + preprice * 0.05).toString(),
          "ether",
        );
        await shop.methods
          .buyBatch(tokensId, amounts, token)
          .send({ from: account, value: price });
      } else {
        const allowance = await ERC20.methods
          .allowance(account, shopAddress)
          .call();

        if (allowance < 1000000000000) {
          setMessageBuy(
            `Increasing the allowance of ${
              tokensAllowed.filter((item) => item.address === tokenSelected)[0]
                .name
            } 1/2`,
          );
          await ERC20.methods
            .increaseAllowance(
              shopAddress,
              "1000000000000000000000000000000000000000000000000",
            )
            .send({
              from: account,
            });
          setMessageBuy("Buying your NFT(s) 2/2");
          await shop.methods
            .buyBatch(tokensId, amounts, tokenSelected)
            .send({ from: account });
        } else {
          setMessageBuy("Buying your NFT(s)");
          await shop.methods
            .buyBatch(tokensId, amounts, tokenSelected)
            .send({ from: account });
        }

        // }
      }

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
      (parseFloat(
        cartShop
          ?.map((item, i) => {
            return (parseInt(item.priceUSD) / 10 ** 6) * item.quantity;
          })
          .reduce((item, acc) => {
            return item + acc;
          }),
      ) *
        10 ** 8) /
      priceMATIC;

    setPriceMatic((price + price * 0.05).toFixed(2).toString());
  };

  React.useEffect(() => {
    if (cartShop.length > 0) {
      getPriceMatic();
    } else {
      setPriceMatic("0");
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
            isShow={isShow}
            cart={cartShop}
            removeAll={removeAll}
            messageBuy={messageBuy}
            withoutX
            tokensAllowed={tokensAllowed}
            setTokenSelected={setTokenSelected}
            tokenSelected={tokenSelected}
            priceMatic={priceMatic}
            buy={buyPacks}
            isMatic
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
                        {nFormatter(parseInt(item.priceUSD) / 10 ** 6)} USD{" "}
                      </h3>
                    </div>
                    <input
                      defaultValue={item.quantity}
                      type="number"
                      min={1}
                      className="text-lg px-2 text-white w-12 bg-transparent rounded-xl border border-overlay-overlay"
                      onChange={(e) => {
                        dispatch(
                          editCart({
                            id: index,
                            item: { ...item, quantity: e.target.value },
                          }),
                        );
                      }}
                    ></input>
                    <div
                      className="rounded-full p-1 w-8 h-8 border border-transparent-color-gray-200 hover:bg-red-primary text-white shrink-0 cursor-pointer"
                      onClick={() => {
                        dispatch(removeFromCart({ id: item.id }));
                      }}
                    >
                      <XIcon></XIcon>
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
                  <h2 className="relative ringBearer sm:text-xl text-sm text-white">
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
                  <h2 className="relative ringBearer sm:text-xl text-sm text-white">
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
                  <h2 className="relative ringBearer sm:text-xl text-sm text-white">
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
                          {sale.price}
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
                          <h2 className="ringBearer text-md text-center text-gray-200 relative">
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
                                className="ringBearer text-xl text-white text-center bg-transparent w-5 outline-none"
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
