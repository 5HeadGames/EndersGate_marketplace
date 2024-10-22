"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { DropdownCart } from "../common/dropdowns/dropdownCart/dropdownCart";
import { useAppDispatch } from "redux/store";
import {
  removeAll,
  removeAllComics,
  removeAllRent,
  removeAllShop,
  rentBatchERC1155,
  rentBatchERC1155Native,
} from "redux/actions";
import { removeFromCart, removeFromCartRent } from "@redux/actions";
import {
  AddressText,
  findSum,
} from "@shared/components/common/specialFields/SpecialFields";
import {
  buyNFTsMatic,
  buyNFTsNative,
  getAddresses,
  getContract,
  getContractCustom,
  getNativeBlockchain,
  getTokensAllowed,
  getTokensAllowedMatic,
  getWeb3,
  hasAggregatorFeed,
} from "@shared/web3";
import { useSelector } from "react-redux";
import React from "react";
import clsx from "clsx";
import packs from "@shared/packs.json";
import { convertArrayCards } from "../common/convertCards";
import { XIcon } from "@heroicons/react/solid";
import { Icons } from "@shared/const/Icons";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useBlockchain } from "@shared/context/useBlockchain";
import { formatPrice, multiply } from "@shared/utils/formatPrice";
import { toast } from "react-hot-toast";
import { useUser } from "@shared/context/useUser";
import Web3 from "web3";
import { useModal } from "@shared/hooks/modal";
import { CHAIN_TRANSAK_BY_NAME } from "@shared/utils/chains";
import { AddFundsModal } from "../common/addFunds";

export const Cart = ({
  tokenSelected,
  setTokenSelected,
  cartOpen,
  setCartOpen,
}) => {
  const [messageBuy, setMessageBuy] = React.useState("");

  const dispatch = useAppDispatch();
  const { showWallet } = useMagicLink();
  const {
    user: { ethAddress, provider, providerName },
  } = useUser();
  const { cart: cartSales, cartRent } = useSelector(
    (state: any) => state.layout,
  );
  const {
    Modal: ModalFunds,
    show: showFunds,
    hide: hideFunds,
    isShow: isShowFunds,
  } = useModal();

  const [priceNative, setPriceNative] = React.useState(0);

  const [balance, setBalance] = React.useState(0);

  const [daysOfRent, setDaysOfRent] = React.useState(1);

  const [cartSelected, setCartSelected] = React.useState("sales");

  const cart = cartSelected === "sales" ? cartSales : cartRent;

  const { blockchain } = useBlockchain();

  const { pack, marketplace, NATIVEUSD } = getAddresses(blockchain);

  const tokensAllowed = getTokensAllowed(blockchain);

  const refCartMobile = React.useRef(null);

  const cards = convertArrayCards();

  React.useEffect(() => {
    if (cart.length > 0 && hasAggregatorFeed(blockchain)) {
      getPriceNative(
        cart
          ?.map((item: any, i) =>
            ((parseInt(item.price) / 10 ** 6) * item.quantity).toString(),
          )
          .reduce((item: any, acc: any) => {
            return findSum(item, acc) as any;
          }),
      );
    } else {
      setPriceNative(0);
    }
  }, [cart]);

  React.useEffect(() => {
    dispatch(removeAll());
    dispatch(removeAllComics());
    dispatch(removeAllRent());
    dispatch(removeAllShop());
  }, [blockchain]);

  const handleRemove = (item) => {
    if (cartSelected === "sales") {
      dispatch(removeFromCart(item));
    } else {
      dispatch(removeFromCartRent(item));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!(await hasBalance())) {
        console.log("no has");
        if (blockchain != "skl" && tokenSelected.transak == true) {
          showFunds();
        } else {
          toast.error(
            "You don't have enough funds to buy, please fill your wallet",
          );
        }
      } else {
        console.log("has balance");
        if (cartSelected === "sales") {
          buyNFTs();
        } else {
          rentNFTs();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const buyNFTs = async () => {
    if (!getNativeBlockchain(blockchain)) {
      if (!tokenSelected.address) {
        return toast.error("Please select a token as a payment");
      }
      await buyNFTsMatic({
        tokenSelected: tokenSelected.address,
        setMessageBuy,
        cart: cartSales,
        marketplace,
        provider,
        ethAddress,
        tokensAllowed,
        NATIVEUSD,
        dispatch,
        blockchain,
      });
    } else {
      await buyNFTsNative({
        setMessageBuy,
        cart: cartSales,
        marketplace,
        provider,
        ethAddress,
        dispatch,
      });
    }
  };

  const rentNFTs = () => {
    if (!getNativeBlockchain(blockchain)) {
      if (!tokenSelected) {
        return toast.error("Please select a token as a payment");
      }
      dispatch(
        rentBatchERC1155({
          blockchain,
          account: ethAddress,
          tokenSelected: tokenSelected.address,
          provider,
          daysOfRent,
          setMessageBuy,
          cartRent,
          dispatch,
        }),
      );
    } else {
      dispatch(
        rentBatchERC1155Native({
          blockchain,
          account: ethAddress,
          provider,
          daysOfRent,
          setMessageBuy,
          cartRent,
          dispatch,
        }),
      );
    }
  };

  const getPriceNative = async (price: any) => {
    const Aggregator = getContractCustom("Aggregator", NATIVEUSD, provider);
    const priceMATIC = await Aggregator.methods.latestAnswer().call();
    const priceNative = (BigInt(price) * BigInt(10 ** 8)) / BigInt(priceMATIC);
    const returnedPrice = parseFloat(
      (
        parseFloat(
          Web3.utils.fromWei(
            (priceNative * BigInt(10 ** 12)).toString(),
            "ether",
          ),
        ) +
        parseFloat(
          Web3.utils.fromWei(
            (priceNative * BigInt(10 ** 12)).toString(),
            "ether",
          ),
        ) *
          0.0005
      ).toFixed(6),
    );
    setPriceNative(returnedPrice);
    return returnedPrice;
  };

  const hasBalanceNative = async (price) => {
    const web3 = await getWeb3(provider);
    var balance = await web3.eth.getBalance(ethAddress);

    if (hasAggregatorFeed(blockchain)) {
      console.log("agg");
      const priceNative = await getPriceNative(price);
      setBalance(parseFloat(Web3.utils.fromWei(balance, "ether")));
      if (priceNative < parseFloat(Web3.utils.fromWei(balance, "ether"))) {
        return true;
      } else {
        return false;
      }
    } else {
      console.log("no agg");
      if (price < balance) {
        return true;
      } else {
        return false;
      }
    }
  };

  const hasBalanceToken = async (price, token) => {
    const ERC20 = await getContract("ERC20", token, blockchain);
    var balance = await ERC20.methods.balanceOf(ethAddress).call();
    var decimals = await ERC20.methods.decimals().call();
    setBalance(balance / 10 ** decimals);
    if (parseInt(balance) >= parseInt(price)) {
      return true;
    } else {
      return false;
    }
  };

  const hasBalance = async () => {
    console.log("has balance join");
    const addresses = getTokensAllowed(blockchain);
    if (
      tokenSelected.address ===
      addresses.filter((item) => item.main)[0]?.address
    ) {
      return await hasBalanceNative(
        cart
          ?.map((item: any, i) =>
            (parseInt(item.price) * item.quantity).toString(),
          )
          .reduce((item: any, acc: any) => {
            return findSum(item, acc) as any;
          }),
      );
    } else {
      return await hasBalanceToken(
        cart
          ?.map((item: any, i) =>
            (parseInt(item.price) * item.quantity).toString(),
          )
          .reduce((item: any, acc: any) => {
            return findSum(item, acc) as any;
          }),
        tokenSelected.address,
      );
    }
  };

  const infoMessage =
    messageBuy !== "" ? (
      <div className="py-2 text-lg text-white font-bold text-center w-full">
        {messageBuy}
      </div>
    ) : (
      ""
    );

  const magicFundOption = providerName === "magic" && blockchain == "matic" && (
    <div className="text-[12px] text-white pt-4 font-bold">
      Don't have crypto? Click{" "}
      <span
        className="text-green-button cursor-pointer"
        onClick={() => {
          showWallet();
        }}
      >
        Here
      </span>{" "}
      and buy by using Magic Connect on-ramp
    </div>
  );

  const SelectDaysOfRent = cartSelected === "rents" && (
    <div className="flex gap-4 justify-between items-center md:w-1/2 w-2/3">
      <label className="text-primary font-bold whitespace-nowrap text-sm">
        Days Of Rent
      </label>
      <input
        type="number"
        className="bg-overlay text-primary text-center w-12 p-1 text-sm rounded-md border border-overlay-border"
        value={daysOfRent}
        min={1}
        onChange={(e) => {
          if (parseInt(e.target.value) > 0) {
            setDaysOfRent(parseInt(e.target.value));
          }
        }}
      />
    </div>
  );

  return (
    <>
      <ModalFunds isShow={isShowFunds} withoutX>
        <AddFundsModal
          amount={
            tokenSelected.address ==
            getTokensAllowed(blockchain)?.filter((item) => item.main)[0]
              ?.address
              ? priceNative
              : cart.length > 0
              ? multiply(
                  cart
                    ?.map((item: any, i) =>
                      (
                        (parseInt(item.price) / 10 ** 6) *
                        item.quantity
                      ).toString(),
                    )
                    .reduce((item: any, acc: any) => {
                      return findSum(item, acc) as any;
                    }) || "0",
                  daysOfRent.toString() || "0",
                )
              : "0"
          }
          reload={hasBalance}
          token={tokenSelected.name}
          tokenSelected={tokenSelected}
          network={CHAIN_TRANSAK_BY_NAME[blockchain]}
          wallet={ethAddress}
          balance={balance}
          loading={false}
          onClick={async () => {
            if (await hasBalance()) {
              if (cartSelected === "sales") {
                buyNFTs();
              } else {
                rentNFTs();
              }
            } else {
              toast.error(
                "You don't have enough funds to buy, please fill your wallet",
              );
            }
          }}
          hide={hideFunds}
        />
      </ModalFunds>
      <DropdownCart
        sidebarOpen={cartOpen}
        initialFocus={refCartMobile}
        items={cart.length}
        setSideBar={setCartOpen}
      >
        <div className="w-full py-2 flex gap-4 justify-center">
          <div
            onClick={() => setCartSelected("rents")}
            className={clsx(
              { "bg-white font-bold !text-overlay": cartSelected !== "sales" },
              "text-white text-center rounded-xl p-2 border border-white cursor-pointer min-w-[33%] transition-all duration-500 relative",
            )}
          >
            {cartRent.length > 0 && (
              <div className="absolute top-[-4px] right-[-8px] w-4 h-4 flex items-center justify-center rounded-full font-bold text-[9px] bg-red-primary text-white">
                {cartRent.length}
              </div>
            )}
            Rents
          </div>
          <div
            onClick={() => setCartSelected("sales")}
            className={clsx(
              { "bg-white font-bold !text-overlay": cartSelected === "sales" },
              "text-white text-center rounded-xl p-2 border border-white cursor-pointer min-w-[33%] transition-all duration-500 relative",
            )}
          >
            {cartSales.length > 0 && (
              <div className="absolute top-[-4px] right-[-8px] w-4 h-4 flex items-center justify-center rounded-full font-bold text-[9px] bg-red-primary text-white">
                {cartSales.length}
              </div>
            )}
            Sales
          </div>
        </div>
        {cart.length ? (
          <div className="flex flex-col items-center border border-overlay-border rounded-md md:min-w-[500px] md:w-max py-2">
            <div className="flex justify-between gap-4 w-full">
              <h2 className="text-xl font-bold text-white py-4 px-4">
                Your {cartSelected === "sales" ? "Sale" : "Rent"} Cart
              </h2>
              <h2 className="text-lg font-bold text-primary-disabled py-4 px-4">
                {cart
                  .map((item) => item.quantity)
                  .reduce((acc, red) => acc + red)}{" "}
                Item
                {cart
                  .map((item) => item.quantity)
                  .reduce((acc, red) => acc + red) > 1
                  ? "s"
                  : ""}
              </h2>{" "}
            </div>
            <div className="px-4 py-2 pb-4 gap-2 flex flex-col items-center w-full">
              {cart.map((item: any, index) => {
                return (
                  <CartItem
                    pack={pack}
                    item={item}
                    blockchain={blockchain}
                    handleRemove={handleRemove}
                    cards={cards}
                  />
                );
              })}
              {SelectDaysOfRent}
            </div>
            <TokenSelection
              blockchain={blockchain}
              tokensAllowed={tokensAllowed}
              cart={cart}
              tokenSelected={tokenSelected}
              setTokenSelected={setTokenSelected}
            />

            <TotalPrice
              cart={cart}
              blockchain={blockchain}
              tokensAllowed={tokensAllowed}
              priceMatic={priceNative}
              daysOfRent={daysOfRent}
              isRentCart={cartSelected === "rents"}
            />
            {magicFundOption}
            {infoMessage}
            <div className="w-full flex items-center justify-center py-2">
              <div
                onClick={() => {
                  handleSubmit();
                }}
                className="w-auto px-6 py-2 flex justify-center items-center rounded-xl hover:border-green-button hover:bg-overlay hover:!text-green-button border border-overlay-border cursor-pointer bg-green-button font-bold text-overlay transition-all duration-500"
              >
                Complete {cartSelected === "sales" ? "Purchase" : "Rent"}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white font-bold gap-4 text-md text-center w-64 p-4 border border-overlay-border rounded-md">
            <img src={Icons.logoCard} className="w-20 h-20" alt="" />
            There aren't items in your cart.
          </div>
        )}
      </DropdownCart>
    </>
  );
};

const TotalPrice = ({
  cart,
  blockchain,
  tokensAllowed,
  priceMatic,
  isRentCart,
  daysOfRent,
}) => {
  return (
    <div className="flex gap-6 justify-between w-full text-md text-xl py-4 px-8 border-y border-overlay-border bg-secondary">
      <div className="flex gap-1 items-center">
        <img src={Icons.logo} className="w-8 h-8" alt="" />
        <h3
          className="text-[12px] text-primary-disabled font-[700]"
          style={{ lineHeight: "14px" }}
        >
          Total price on <br />
          <span className="text-red-primary font-bold">5</span>
          <span className="text-white font-bold">HG</span> Marketplace:
        </h3>
      </div>
      <div className="flex flex-col gap items-end">
        <h3 className="text-[14px] font-[700] text-white">
          {isRentCart
            ? formatPrice(
                cart
                  ?.map(
                    (item: any, i) => BigInt(item.price) * BigInt(daysOfRent),
                  )
                  .reduce((item: any, acc: any) => {
                    return BigInt(item) + BigInt(acc);
                  }),
                blockchain,
              )
            : formatPrice(
                cart
                  ?.map(
                    (item: any, i) =>
                      BigInt(item.price) * BigInt(item.quantity),
                  )
                  .reduce((item: any, acc: any) => {
                    return BigInt(item) + BigInt(acc);
                  }),
                blockchain,
              )}
        </h3>
        {tokensAllowed
          .filter((item) => item.name === "MATIC")
          .filter((tokenAllowed) => {
            let intersection = true;
            cart.forEach((item) => {
              if (!item?.tokens?.includes(tokenAllowed.address)) {
                intersection = false;
              }
            });
            return intersection;
          }).length > 0 && (
          <h3 className="text-[14px] font-[700] text-white">
            {isRentCart ? priceMatic * daysOfRent : priceMatic} MATIC
          </h3>
        )}
      </div>
    </div>
  );
};

const TokenSelection = ({
  blockchain,
  tokensAllowed,
  cart,
  tokenSelected,
  setTokenSelected,
}) => {
  return (
    <>
      {!getNativeBlockchain(blockchain) && (
        <>
          <h2 className="text-xs pb-2 text-green-button font-bold">
            Select a currency to make the payment
          </h2>
          <div className="flex  gap-4 pb-4 w-full flex-wrap items-center justify-center">
            {tokensAllowed
              .filter((tokenAllowed) => {
                let intersection = true;
                cart.forEach((item) => {
                  if (
                    !item?.tokens
                      ?.map((item) => item.toLowerCase())
                      ?.includes(tokenAllowed.address.toLowerCase())
                  ) {
                    intersection = false;
                  }
                });
                return intersection;
              })
              .map((item: any, index) => {
                return (
                  <div
                    key={tokenSelected.address + item.name}
                    className={clsx(
                      "w-20 flex items-center justify-center gap-1 rounded-xl cursor-pointer py-1 border border-white",

                      {
                        "bg-overlay-border border-none":
                          tokenSelected.address !== item.address,
                      },
                      {
                        "bg-overlay border-green-button shadow-[0_0px_10px] shadow-green-button":
                          tokenSelected.address === item.address,
                      },
                    )}
                    onClick={() => {
                      setTokenSelected(item);
                    }}
                  >
                    <img src={item.logo} className="w-6 h-6" alt="" />
                    <h2 className="text-white text-[13px] font-bold">
                      {item.name}
                    </h2>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </>
  );
};

const CartItem = ({ item, pack, cards, blockchain, handleRemove }) => {
  return (
    <div
      key={"item-cart-" + item.nft + item.nftId}
      className={clsx(
        "py-2 flex items-center justify-between gap-8 text-white cursor-pointer w-full px-2 border border-overlay-border rounded-md",
      )}
      // onClick={item.onClick}
    >
      <div className="flex items-center justify-start gap-2 w-full">
        <div className="rounded-xl flex flex-col text-gray-100 relative overflow-hidden border border-gray-500 h-20 w-20">
          <img
            src={
              item.nft === pack
                ? packs[item.nftId]?.properties?.image?.value
                : cards[item.nftId]?.image
            }
            className={`absolute top-[-20%] bottom-0 left-[-40%] right-0 margin-auto min-w-[175%]`}
            alt=""
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className={clsx("text-md font-[700] uppercase")}>
            {item.nft === pack
              ? packs[item.nftId]?.properties?.name?.value
              : cards[item.nftId]?.properties?.name?.value}
          </h3>
          <span
            className="text-[12px] text-gray-500 font-medium"
            style={{ lineHeight: "10px" }}
          >
            Owner: {item.seller ? <AddressText text={item.seller} /> : "Owner"}
          </span>
          <div className="flex gap-2 items-end">
            <img src={Icons.logo} className="w-8 h-8" alt="" />
            <img src={`/images/${blockchain}.png`} className="w-6 h-6" alt="" />
          </div>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <div className="flex flex-col !shrink-0">
          <h3 className={clsx("text-sm font-[700] whitespace-nowrap w-24")}>
            Price:
          </h3>
          <h3
            className={clsx(
              "text-sm font-[700] uppercase whitespace-nowrap w-24",
            )}
          >
            {formatPrice(item.price, blockchain)}
          </h3>
          <h3 className={clsx("text-sm font-[700] whitespace-nowrap w-max")}>
            Highest Bid:
          </h3>
          <h3
            className={clsx(
              "text-sm font-[700] uppercase whitespace-nowrap w-max",
            )}
          >
            {formatPrice(item.price, blockchain)}
          </h3>
        </div>
        <div className="text-lg">x{item.quantity}</div>
        <div
          className="rounded-full p-1 w-8 h-8 border border-overlay-border hover:bg-red-primary text-white shrink-0"
          onClick={() => {
            handleRemove({ id: item.id });
          }}
        >
          <XIcon />
        </div>
      </div>
    </div>
  );
};
