/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { LoadingOutlined, ShopOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { useRouter } from "next/router";
import {
  getAddresses,
  getContractCustom,
  getNativeBlockchain,
  getTokensAllowed,
  sendFirebaseTx,
  switchChain,
  hasAggregatorFeed,
} from "@shared/web3";
import {
  addCartShop,
  editCartShop,
  buyFromShop,
  buyFromShopNative,
  onGetAssets,
  removeAll,
  removeAllShop,
  removeFromCartShop,
} from "@redux/actions";
import { toast } from "react-hot-toast";
import { CHAIN_IDS_BY_NAME } from "@shared/utils/chains";
import { useBlockchain } from "@shared/context/useBlockchain";
import { formatPrice } from "@shared/utils/formatPrice";
import { useCartModal } from "@shared/components/common/cartModal";
import { XIcon } from "@heroicons/react/solid";
import { useUser } from "@shared/context/useUser";
import { useForm } from "react-hook-form";
import { packsShop, updateSales } from "@shared/utils/utils";
import { DropdownShop } from "@shared/components/common/dropdowns/dropdownShop";
import Web3 from "web3";

const Shop = () => {
  const {
    user: { ethAddress: account, provider, providerName },
  } = useUser();
  const [sales, setSales] = useState([]);
  const [saleToShow, setSale] = useState(packsShop[0]);
  const [counters, setCounters] = useState([1, 1, 1, 1]);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidCode, setValidCode] = useState(false);
  const router = useRouter();
  const [tokenSelected, setTokenSelected] = React.useState("");
  const [messageBuy, setMessageBuy] = React.useState("");
  const { addToast } = useToasts();
  const [priceNative, setPriceNative] = React.useState("0");

  const { blockchain, updateBlockchain } = useBlockchain();

  const tokensAllowed = getTokensAllowed(blockchain);

  const { Modal, show, isShow, hide } = useCartModal();

  const { cartShop } = useSelector((state: any) => state.layout);

  const { shop: shopAddress, NATIVEUSD } = getAddresses(blockchain);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
    setValue,
    clearErrors,
  } = useForm();

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (tokensAllowed) {
      setTokenSelected(tokensAllowed[0].address);
    }
  }, [tokensAllowed]);

  React.useEffect(() => {
    if (blockchain) {
      try {
        switchChain(CHAIN_IDS_BY_NAME[blockchain]);
        updateSales({
          setIsLoading,
          blockchain,
          shopAddress,
          setSales,
          setCounters,
        });
        dispatch(removeAllShop());
      } catch (err) {
        toast.error(
          "An error occurred while changing the network, please try again.",
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockchain]);

  const buyPacks = async (data) => {
    const { influencer_code } = data;

    try {
      const changed = await switchChain(CHAIN_IDS_BY_NAME[blockchain]);
      console.log(changed);
      if (!changed) return;
      if (influencer_code && !isValidCode) return;
      updateBlockchain(blockchain);

      if (tokenSelected === "") {
        addToast("Please Select a Payment Method", { appearance: "error" });
        return;
      }

      let tx: any = "";
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
      if (tx.payload.err) throw Error(tx.payload.err.message);
      if (influencer_code) {
        sendFirebaseTx({ tx: tx.payload, influencer_code });
        setValue("influencer_code", "");
      }
      dispatch(onGetAssets({ address: account, blockchain }));
      updateSales({
        setIsLoading,
        blockchain,
        shopAddress,
        setSales,
        setCounters,
      });
      hide();
      dispatch(removeAll());
    } catch (error) {
      console.log(error);
    }
    setMessageBuy(``);
  };

  const getPriceMatic = async () => {
    const Aggregator = getContractCustom("Aggregator", NATIVEUSD, provider);
    const priceMATIC = await Aggregator.methods.latestAnswer().call();
    const price =
      (BigInt(
        cartShop
          ?.map((item, i) => {
            console.log(item.price);
            return BigInt(item.price) * BigInt(item.quantity);
          })
          .reduce((item, acc) => {
            return BigInt(item) + BigInt(acc);
          }) * BigInt(10 ** 8),
      ) /
        BigInt(priceMATIC)) *
      BigInt(10 ** 12);
    console.log(price);
    setPriceNative(
      Web3.utils.fromWei(
        (price + (price * BigInt(2)) / BigInt(100)).toString(),
        "ether",
      ),
    );
  };

  React.useEffect(() => {
    if (sales.length) setSale(sales[0]);
  }, [sales]);

  React.useEffect(() => {
    if (
      cartShop.length > 0 &&
      !getNativeBlockchain(blockchain) &&
      hasAggregatorFeed(blockchain)
    ) {
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
          className="w-full h-full relative overflow-hidden shop flex flex-col items-center pb-16"
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
            providerName={providerName}
            handleSubmit={handleSubmit}
            errors={errors}
            isValidCode={isValidCode}
            itemsCart={cartShop.map((item, index) => {
              return (
                <div
                  key={"pack-shop-" + item.nftId}
                  className={clsx(
                    "py-2 flex items-center justify-between sm:gap-8 gap-2 text-white cursor-pointer w-full px-2 border border-transparent-color-gray-200 rounded-xl",
                  )}
                >
                  <div className="flex items-center justify-start gap-2 w-full">
                    <div className="rounded-xl flex flex-col text-gray-100 relative overflow-hidden border border-gray-500 sm:h-20 sm:w-20 w-16 h-16">
                      <img
                        src={packsShop[item.nftId]?.imagePack}
                        className={`absolute top-[-40%] left-[-40%] right-0 m-auto min-w-[175%]`}
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3
                        className={clsx(
                          "sm:text-md text-sm font-[700] uppercase",
                        )}
                      >
                        {packsShop[item.nftId]?.name}
                      </h3>

                      <div className="flex gap-2 items-end">
                        <img
                          src={"icons/logo.png"}
                          className="sm:w-8 sm:h-8 w-7 h-7"
                          alt=""
                        />
                        <img
                          src={`images/${blockchain}.png`}
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
                          "text-sm font-[700] whitespace-nowrap sm:w-24 w-16",
                        )}
                      >
                        Price:
                      </h3>
                      <h3
                        className={clsx(
                          "text-sm font-[700] uppercase whitespace-nowrap sm:w-24 w-16",
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
            src="/images/shop/shop_background.png"
            className="flex absolute z-0 w-full h-full"
            alt="bg-shop"
          />
          <img
            src="/images/shop/bg_top.png"
            className="w-full h-full relative pt-12"
            alt="bg-top"
          />
          <h1 className="Poppins relative border-y-4 border-[#B8902E] Poppins text-white sm:text-5xl text-4xl text-center font-[600] py-12 w-full">
            CARD SHOP
          </h1>

          <div className="flex xl:flex-row flex-col xl:justify-between xl:items-end items-center relative w-full pt-6">
            <div className="flex w-full items-center justify-center gap-2">
              <DropdownShop>
                <>
                  {" "}
                  <div className="relative sm:w-64 w-40">
                    <div className="absolute flex shrink-0 items-center justify-center w-full h-full">
                      <h2 className="relative  sm:text-xl text-md text-white">
                        NFT PACKS
                      </h2>
                    </div>
                    <img
                      src="./images/bgGold.png"
                      className="cursor-pointer"
                      alt=""
                    />
                  </div>
                  <div className="relative sm:w-64 w-40">
                    <div className="absolute flex shrink-0 items-center justify-center w-full h-full">
                      <h2 className="relative  sm:text-xl text-md text-white">
                        AVATAR CARDS
                      </h2>
                    </div>
                    <img
                      src="./images/bgNonSelected.png"
                      className="cursor-pointer"
                      alt=""
                    />
                  </div>
                  <div className="relative sm:w-64 w-40">
                    <div className="absolute flex shrink-0 items-center justify-center w-full h-full">
                      <h2 className="relative  sm:text-xl text-md text-white">
                        EG COMICS
                      </h2>
                    </div>
                    <img
                      src="./images/bgNonSelected.png"
                      className="cursor-pointer"
                      alt=""
                    />
                  </div>
                </>
              </DropdownShop>
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
          <div className="2xl:w-4/5 w-full 2xl:px-0 xl:px-16 lg:px-10 px-8 flex xl:flex-row xl:items-start xl:justify-start flex-col items-center justify-center xl:gap-10 gap-8 pt-10">
            <div className="relative w-full flex md:flex-row flex-col md:items-start items-center xl:w-[50%]">
              <div
                className={clsx(
                  "flex flex-col items-center justify-center w-full gap-2 border border-white p-4 pt-2",
                )}
              >
                {sales?.map((sale) => {
                  return (
                    <SaleButton
                      saleSelected={saleToShow?.name}
                      sale={sale}
                      setSale={setSale}
                    />
                  );
                })}
              </div>
            </div>
            <div className="relative w-full flex md:flex-row flex-col md:items-start items-center xl:w-[50%]">
              <div className={clsx("flex w-full")}>
                <ShopElement
                  sale={saleToShow}
                  counters={counters}
                  setCounters={setCounters}
                  index={saleToShow.index}
                />
              </div>
            </div>
          </div>
          <div className="sm:block hidden pt-56 w-full"></div>
          <div
            className="fixed bottom-4 right-4 p-2 py-1 rounded-full bg-overlay lg:hidden flex items-center justify-center hover:bg-primary  text-white cursor-pointer z-10"
            onClick={() => {
              show();
            }}
          >
            <div className="relative flex items-center justify-center p-3">
              {cartShop.length > 0 && (
                <p
                  className="px-2 py-0.5 rounded-full flex items-center justify-center absolute top-0 left-0 bg-yellow-600 text-white font-bold"
                  style={{ fontSize: "11px" }}
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

const SaleButton = ({ sale, saleSelected, setSale }) => {
  return (
    <button
      className={clsx(
        "border-b border-white w-full relative flex justify-between items-center",
      )}
      onClick={() => {
        setSale(sale);
      }}
    >
      <img
        src="/images/shop/selected_pack_effect.png"
        className={clsx("w-full absolute h-full top-0", {
          hidden: sale.name != saleSelected,
        })}
        alt=""
      />
      <p
        className={clsx(
          { "md:hidden !text-[#F1E298]": sale.name === saleSelected },
          "py-2 px-5 md:text-xl sm:text-lg text-[14px] text-white text-left RingBearer lowercase",
        )}
      >
        {sale?.nameList}
      </p>
      <img
        src={sale?.imageList}
        className={clsx(
          { "!hidden": sale.name !== saleSelected },
          "h-[35px] py-2 px-4 relative md:flex hidden",
        )}
        alt={sale?.nameList}
      />
      <p className="py-2 px-4 text-white text-left sm:text-lg text-[12px]">
        {sale?.currentPrice}
      </p>
    </button>
  );
};

const ShopElement = ({ sale, counters, setCounters, index }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    user: { ethAddress: account },
  } = useUser();
  const { cartShop } = useSelector((state: any) => state.layout);

  return (
    <div className="relative flex sm:flex-row flex-col border border-white w-full p-3">
      <div className="flex flex-col items-center justify-center relative h-full py-6 px-4 shadow-white sm:w-2/5 w-full">
        <img
          src="./images/box_pack.png"
          className="absolute w-full h-full"
          alt=""
        />

        <img
          src={sale?.imagePack}
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
          <h2 className="Poppins font-[500] text-md text-center text-gray-200 relative">
            {sale?.amount} LEFT
          </h2>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 p-4 sm:w-3/5 w-full">
        <div className="w-full flex flex-col">
          <h2 className="text-primary-disabled text-sm font-[500] w-full">
            ELEMENTAL CONFLICT
          </h2>
          <h1
            className={clsx("text-3xl font-[600] uppercase Poppins")}
            style={{ color: sale?.color }}
          >
            {sale?.name}
          </h1>
          <img src="/images/shop/line2.png" className="w-full mb-4" alt="" />
          <p className="Poppins text-primary-disabled text-sm font-[400] relative">
            {sale?.description}
          </p>
        </div>

        <div
          className={clsx(
            "flex justify-between gap-4 w-full relative shadow-white py-4",
          )}
        >
          <div className="flex gap-2">
            <div
              className="cursor-pointer text-xl text-white px-4 py-1 font-bold rounded-md border border-white"
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
              className="text-xl text-white text-center bg-transparent px-4 py-1 font-bold rounded-md border border-white"
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
              className="cursor-pointer text-xl text-white px-4 py-1 font-bold rounded-md border border-white"
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
        </div>
        <div className="flex w-full gap-2 relative items-start">
          {sale?.previousPrice && (
            <h2 className="Poppins uppercase text-3xl font-[600] text-center text-primary-disabled relative">
              {sale?.previousPrice}
              <img
                src="/images/shop/line_text.png"
                className="h-full absolute top-0 "
                alt=""
              />
            </h2>
          )}
          <h2 className="Poppins uppercase text-3xl font-[600] text-center text-white relative">
            {sale?.currentPrice}
          </h2>
          {sale.percentageOff && (
            <div className="flex items-center justify-center relative px-2 ">
              <img
                src="/images/shop/bg-off.png"
                className="absolute h-full rounded-lg top-0 shadow-white"
                alt=""
              />
              <p className="Poppins uppercase text-md text-center text-green-button relative font-[500] h-6">
                {sale?.percentageOff}
              </p>
            </div>
          )}
        </div>
        <div className="w-full">
          <div
            className="text-xl cursor-pointer relative px-6 py-1 flex items-center justify-center w-fit"
            onClick={() => {
              if (account) {
                if (
                  cartShop
                    .map((item) => {
                      return item.id;
                    })
                    .includes(sale?.id)
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
                  toast.success(
                    "Your item has been edited successfully to the cart",
                  );
                } else {
                  dispatch(
                    addCartShop({
                      ...sale,
                      quantity: counters[index],
                    }),
                  );
                  toast.success(
                    "Your item has been added successfully to the cart",
                  );
                }
              } else {
                router.push("/login");
              }
            }}
          >
            <img
              src="/images/shop/button_shop.svg"
              className="h-full absolute top-0"
              alt=""
            />
            <h2 className="RingBearer text-black relative font-black">
              {account ? "add to cart" : "login to buy"}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
