import React, { useState } from "react";
// import ShopABI from "../contracts/ClockAuction.json";
import { LoadingOutlined, ShopOutlined } from "@ant-design/icons";
import clsx from "clsx";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
import {
  findSum,
  nFormatter,
} from "@shared/components/common/specialFields/SpecialFields";
import { networkConfigs } from "@shared/components/helpers/networks";

import { XIcon } from "@heroicons/react/solid";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useCartModal } from "@shared/components/common/cartModal";
import { useToasts } from "react-toast-notifications";
import { useRouter } from "next/router";
import Link from "next/link";
import { getContractCustom, getTokensAllowed } from "@shared/web3";
import { addCart, removeAll, removeFromCart } from "@redux/actions";
// import polygon from "../../assets/POLYGON.svg";

const Shop = () => {
  const [web3, setWeb3] = useState(null);
  const {
    ethAddress: account,
    provider,
    providerName,
  } = useSelector((state: any) => state.blockchain.user);
  const [contract, setContract] = useState(null);
  const [sales, setSales] = useState([]);
  const [counters, setCounters] = useState([1, 1, 1, 1]);
  const [isLoading, setIsLoading] = useState(false);
  const [packLoading, setPackLoading] = React.useState(null);
  const [saleSelected, setSaleSelected] = useState();
  const router = useRouter();
  const [buyNFTData, setBuyNFTData] = React.useState({ id: 0, amount: 0 });
  const [priceMatic, setPriceMatic] = React.useState("0");
  const [tokenSelected, setTokenSelected] = React.useState("");
  const [messageBuy, setMessageBuy] = React.useState("");
  const { addToast } = useToasts();

  const tokensAllowed = getTokensAllowed();

  const { Modal, show, isShow, hide } = useCartModal();

  const { showWallet } = useMagicLink();

  const {
    network,
    addresses: { shop: shopAddress, MATICUSD },
    networkName,
    cart,
  } = useSelector((state: any) => state.blockchain);

  const dispatch = useDispatch();

  React.useEffect(() => {
    console.log(MATICUSD, "aggregator");
    if (cart.length > 0) {
      getPriceMatic();
    } else {
      setPriceMatic("0");
    }
  }, [cart]);

  React.useEffect(() => {
    setTokenSelected(tokensAllowed[0].address);
  }, [tokensAllowed]);

  const packs = [
    {
      name: "Common Pack",
      imagePack: "./assets/packs/common1080.png",
      quantity: "8000",
      price: "25 USD in MATIC Token",
      imageCoin: "./assets/shop/coins1.png",
      color: "#FFA6FF",
    },
    {
      name: "Rare Pack",
      imagePack: "./assets/packs/rare1080.png",
      quantity: "6000",
      price: "50 USD in MATIC Token",
      imageCoin: "./assets/shop/coins2.png",
      color: "#E9D880",
    },
    {
      name: "Epic Pack",
      imagePack: "./assets/packs/epic1080.png",
      quantity: "4000",
      price: "100 USD in MATIC Token",
      imageCoin: "./assets/shop/coins3.png",
      color: "#7FBADD",
    },
    {
      name: "Legendary Pack",
      imagePack: "./assets/packs/legendary1080.png",
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
      const web3 = new Web3(networkConfigs[network].rpc);
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
      console.log(created);
      // Update State
      setWeb3(web3);
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
    // if (provider) {
    updateSales();
    // }
  }, []);

  const getPriceMatic = async () => {
    console.log(MATICUSD, "aggregator");
    const Aggregator = getContractCustom("Aggregator", MATICUSD, provider);
    const priceMATIC = await Aggregator.methods.latestAnswer().call();
    console.log(priceMATIC, "price");
    const price =
      (parseFloat(
        cart
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

  const buyPacks = async () => {
    const shop = await getContractCustom("Shop", shopAddress, provider);

    if (tokenSelected == "") {
      addToast("Please Select a Payment Method", { appearance: "error" });
      return;
    }
    try {
      console.log(tokenSelected, "token to pay");

      setMessageBuy(`Processing your purchase...`);

      const { amounts, bid, token, tokensId } = {
        amounts: cart.map((item) => item.quantity),
        bid: cart
          ?.map((item, i) =>
            ((parseInt(item.priceUSD) / 10 ** 6) * item.quantity).toString(),
          )
          .reduce((item, acc) => {
            return findSum(item, acc);
          }),
        token: tokenSelected,
        tokensId: cart.map((item) => item.id),
      };

      let price = "0";
      const ERC20 = getContractCustom("ERC20", token, provider);
      const addressesAllowed = getTokensAllowed();
      if (
        tokenSelected ==
        addressesAllowed.filter((item) => item.name == "MATIC")[0].address
      ) {
        const Aggregator = getContractCustom("Aggregator", MATICUSD, provider);
        const priceMATIC = await Aggregator.methods.latestAnswer().call();
        const preprice =
          (parseFloat(
            cart
              ?.map((item, i) => {
                return (parseInt(item.priceUSD) / 10 ** 6) * item.quantity;
              })
              .reduce((item, acc) => {
                return item + acc;
              }),
          ) *
            10 ** 8) /
          priceMATIC;
        console.log(preprice, "preprice");
        price = Web3.utils.toWei(
          (preprice + preprice * 0.05).toString(),
          "ether",
        );
        console.log(price, "price");
        await shop.methods
          .buyBatch(tokensId, amounts, token)
          .send({ from: account, value: price });
      } else {
        console.log("in", account, shopAddress);
        const allowance = await ERC20.methods
          .allowance(account, shopAddress)
          .call();
        console.log("in", allowance);

        if (allowance < 1000000000000) {
          setMessageBuy(
            `Increasing the allowance of ${
              tokensAllowed.filter((item) => item.address == tokenSelected)[0]
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

  console.log(cart);

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center relative w-screen h-screen overflow-hidden pt-28 relative">
          <div className="absolute left-0 right-0 mx-auto top-0 z-0 flex w-full bgPackContainer">
            <img
              src="./assets/inventory/background.png"
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
            cart={cart}
            removeAll={removeAll}
            messageBuy={messageBuy}
            withoutX
            tokensAllowed={tokensAllowed}
            setTokenSelected={setTokenSelected}
            tokenSelected={tokenSelected}
            buy={buyPacks}
            isMatic
            itemsCart={cart.map((item, index) => {
              return (
                <div
                  className={clsx(
                    "gap-2 py-2 flex items-center justify-between gap-8 text-white cursor-pointer w-full px-2 border border-transparent-color-gray-200 rounded-xl",
                  )}
                  // onClick={item.onClick}
                >
                  <div className="flex items-center justify-start gap-2 w-full">
                    <div className="rounded-xl flex flex-col text-gray-100 relative overflow-hidden border border-gray-500 h-20 w-20">
                      <img
                        src={packs[item.nftId]?.imagePack}
                        className={`absolute bottom-0 top-0 left-[-40%] right-0 m-auto min-w-[175%]`}
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
                        {/* <span className="!text-sm text-transparent-color-gray-200">
                                    ($1.5k)
                                  </span> */}
                      </h3>
                    </div>
                    <input
                      defaultValue={item.quantity}
                      type="number"
                      min={1}
                      className="text-lg px-2 text-white w-12 bg-transparent rounded-xl border border-overlay-overlay"
                      onChange={(e) => {
                        console.log(e.target.value);
                        dispatch(
                          editCart({
                            id: index,
                            item: { ...item, quantity: e.target.value },
                          }),
                        );
                        getPriceMatic();
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
            src="./assets/inventory/background.png"
            className="flex absolute z-0 w-full h-full"
            alt=""
          />
          <div className="relative border-b border-secondary Poppins text-white text-4xl text-center font-black py-12 w-full">
            NFT SHOP
          </div>

          <div className="flex xl:flex-row flex-col w-full xl:justify-between xl:items-end items-center relative w-full pt-6">
            <div className="flex w-full items-center justify-center gap-2">
              <div className="relative md:w-64 sm:w-40 w-24">
                <div className="absolute flex shrink-0 items-center justify-center w-full h-full">
                  <h2 className="relative ringBearer sm:text-xl text-sm text-white">
                    NFT PACKS
                  </h2>
                </div>
                <img
                  src="./assets/inventory/bgGold.png"
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
                  src="./assets/inventory/bgNonSelected.png"
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
                  src="./assets/inventory/bgNonSelected.png"
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
                  src="./assets/inventory/bgGold.png"
                  className="cursor-pointer absolute w-full h-full"
                  alt=""
                />

                {cart.length > 0 && (
                  <div className="p-1 rounded-full flex items-center justify-center absolute top-1 left-1 bg-primary-disabled min-w-4 min-h-4 z-10">
                    <p
                      className="flex items-center justify-center w-4 h-4"
                      style={{ fontSize: "10px" }}
                    >
                      {cart
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
                    <div className="relative packShopContainer shadow-white">
                      <img
                        src="./assets/shop/box_pack.png"
                        className="absolute w-full h-full"
                        alt=""
                      />
                      <div
                        className={clsx(
                          { ["hidden"]: packLoading !== sale.id },
                          "absolute w-full h-full flex items-center justify-center bg-dark opacity-50 text-white z-50 text-3xl",
                        )}
                      >
                        <LoadingOutlined></LoadingOutlined>
                      </div>

                      <div className="flex flex-col items-center justify-center h-full py-2">
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
                                  console.log(
                                    cart,
                                    sale,
                                    cart
                                      .map((item) => {
                                        return item.id;
                                      })
                                      .includes(sale.id),
                                    cart
                                      .map((item) => {
                                        return item.id;
                                      })
                                      .indexOf(sale.id),
                                    "cart",
                                  );
                                  if (
                                    cart
                                      .map((item) => {
                                        return item.id;
                                      })
                                      .includes(sale.id)
                                  ) {
                                    dispatch(
                                      editCart({
                                        item: {
                                          ...sale,
                                          quantity: counters[index],
                                        },
                                        id: cart
                                          .map((item) => {
                                            return item.id;
                                          })
                                          .indexOf(sale.id),
                                      }),
                                    );
                                  } else {
                                    dispatch(
                                      addCart({
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
                <div className="ringBearer text-white py-40 w-full text-center z-50">
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
              {cart.length > 0 && (
                <p
                  className="px-1 rounded-full flex items-center justify-center absolute top-2 left-2 bg-primary w-2 h-2"
                  style={{ fontSize: "10px" }}
                >
                  {cart
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
