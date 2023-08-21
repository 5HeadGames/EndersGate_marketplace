/* eslint-disable react-hooks/exhaustive-deps */
import { DropdownCart } from "../common/dropdownCart/dropdownCart";
import { useAppDispatch } from "redux/store";
import { rentBatchERC1155 } from "redux/actions";
import { removeFromCart, removeFromCartRent } from "@redux/actions";
import {
  AddressText,
  findSum,
} from "@shared/components/common/specialFields/SpecialFields";
import { useToasts } from "react-toast-notifications";
import {
  buyNFTsMatic,
  buyNFTsNative,
  getAddresses,
  getContractCustom,
  getTokensAllowed,
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
import { formatPrice } from "@shared/utils/formatPrice";
import { toast } from "react-hot-toast";

export const Cart = ({
  tokenSelected,
  setTokenSelected,
  cartOpen,
  setCartOpen,
}) => {
  const [messageBuy, setMessageBuy] = React.useState("");

  const { addToast } = useToasts();
  const dispatch = useAppDispatch();
  const tokensAllowed = getTokensAllowed();
  const { showWallet } = useMagicLink();
  const { ethAddress } = useSelector((state: any) => state.layout.user);
  const {
    provider,
    providerName,
    cart: cartSales,
    cartRent,
  } = useSelector((state: any) => state.layout);

  const [priceMatic, setPriceMatic] = React.useState("0");

  const [daysOfRent, setDaysOfRent] = React.useState(1);

  const [cartSelected, setCartSelected] = React.useState("sales");

  const cart = cartSelected === "sales" ? cartSales : cartRent;

  const { blockchain } = useBlockchain();

  const { pack, marketplace, MATICUSD } = getAddresses(blockchain);

  const refCartMobile = React.useRef(null);

  const cards = convertArrayCards();

  React.useEffect(() => {
    if (cart.length > 0 && blockchain === "matic") {
      getPriceMatic();
    } else {
      setPriceMatic("0");
    }
  }, [cart]);

  const getPriceMatic = async () => {
    const Aggregator = getContractCustom("Aggregator", MATICUSD, provider);
    const priceMATIC = await Aggregator.methods.latestAnswer().call();
    const price = (
      (parseInt(
        cart
          ?.map((item: any) =>
            ((parseInt(item.price) / 10 ** 6) * item.quantity).toString(),
          )
          .reduce((item: any, acc: any) => {
            return findSum(item, acc) as any;
          }),
      ) *
        10 ** 8) /
      priceMATIC
    )
      .toFixed(2)
      .toString();

    setPriceMatic(price);
  };

  const handleRemove = (item) => {
    if (cartSelected === "sales") {
      dispatch(removeFromCart(item));
    } else {
      dispatch(removeFromCartRent(item));
    }
  };

  const handleSubmit = () => {
    if (cartSelected === "sales") {
      buyNFTs();
    } else {
      rentNFTs();
    }
  };

  const buyNFTs = () => {
    if (blockchain === "matic") {
      if (!tokenSelected) {
        return toast.error("Please select a token as a payment");
      }
      buyNFTsMatic({
        tokenSelected,
        addToast,
        setMessageBuy,
        cart: cartSales,
        marketplace,
        provider,
        ethAddress,
        tokensAllowed,
        MATICUSD,
        dispatch,
      });
    } else {
      buyNFTsNative({
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
    if (!tokenSelected) {
      return toast.error("Please select a token as a payment");
    }
    dispatch(
      rentBatchERC1155({
        blockchain,
        account: ethAddress,
        tokenSelected,
        provider,
        daysOfRent,
        setMessageBuy,
        cartRent,
        dispatch,
      }),
    );
  };

  const infoMessage =
    messageBuy !== "" ? (
      <div className="py-2 text-lg text-white font-bold text-center w-full">
        {messageBuy}
      </div>
    ) : (
      ""
    );

  const magicFundOption = providerName === "magic" &&
    blockchain === "matic" && (
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
    <DropdownCart
      sidebarOpen={cartOpen}
      initialFocus={refCartMobile}
      items={cart.length}
      setSideBar={setCartOpen}
    >
      {/* <div className="w-full py-2 flex gap-4 justify-center">
        <div
          onClick={() => setCartSelected("rents")}
          className={clsx(
            { "bg-white font-bold !text-overlay": cartSelected !== "sales" },
            "text-white text-center rounded-xl p-2 border border-white cursor-pointer min-w-[33%] transition-all duration-500",
          )}
        >
          Rents
        </div>
        <div
          onClick={() => setCartSelected("sales")}
          className={clsx(
            { "bg-white font-bold !text-overlay": cartSelected === "sales" },
            "text-white text-center rounded-xl p-2 border border-white cursor-pointer min-w-[33%] transition-all duration-500",
          )}
        >
          Sales
        </div>
      </div> */}
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
            {cart.map((item, index) => {
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
            priceMatic={priceMatic}
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
              className="w-auto px-6 py-2 flex justify-center items-center rounded-xl hover:border-green-button hover:bg-overlay hover:text-green-button border border-overlay-border cursor-pointer bg-green-button font-bold text-overlay transition-all duration-500"
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
                  ?.map((item: any, i) =>
                    (parseInt(item.price) * daysOfRent).toString(),
                  )
                  .reduce((item: any, acc: any) => {
                    return findSum(item, acc) as any;
                  }),
                blockchain,
              )
            : formatPrice(
                cart
                  ?.map((item: any, i) =>
                    (parseInt(item.price) * item.quantity).toString(),
                  )
                  .reduce((item: any, acc: any) => {
                    return findSum(item, acc) as any;
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
      {blockchain === "matic" && (
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
              .map((item, index) => {
                return (
                  <div
                    key={tokenSelected + item.name}
                    className={clsx(
                      "w-20 flex items-center justify-center gap-1 rounded-xl cursor-pointer py-1 border border-white",

                      {
                        "bg-overlay-border border-none":
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
                : cards[item.nftId]?.properties.image?.value
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
            Owner: {<AddressText text={item.seller} /> || "Owner"}
          </span>
          <div className="flex gap-2 items-end">
            <img src={Icons.logo} className="w-8 h-8" alt="" />
            <img src="icons/POLYGON.svg" className="w-6 h-6" alt="" />
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
