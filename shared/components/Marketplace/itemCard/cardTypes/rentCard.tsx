"use client";
import { CheckIcon, PlusIcon, SearchIcon, XIcon } from "@heroicons/react/solid";
import { addCart, addCartRent, removeFromCart } from "@redux/actions";
import { useAppDispatch } from "@redux/store";
import { AddressText } from "@shared/components/common/specialFields/SpecialFields";
import { Icons } from "@shared/const/Icons";
import { useBlockchain } from "@shared/context/useBlockchain";
import { useUser } from "@shared/context/useUser";
import { formatPrice } from "@shared/utils/formatPrice";
import {
  getNativeBlockchain,
  getTokensAllowed,
  getTokensAllowedMatic,
} from "@shared/web3";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

export const RentCard = ({ classes, rent, icon, name, setPage }: any) => {
  const dispatch = useAppDispatch();
  const { cartRent } = useSelector((state: any) => state.layout);
  const { user } = useUser();
  const [hoverAll, setHoverAll] = React.useState(false);
  const [hoverBuy, setHoverBuy] = React.useState(false);
  const router = useRouter();

  const { blockchain } = useBlockchain();

  const handleAdd = (e) => {
    e.preventDefault();
    if (user?.ethAddress) {
      if (rent.blockchain !== blockchain) {
        toast.error("Please select sales in the same blockchain");
        return false;
      }

      if (!getNativeBlockchain(blockchain)) {
        let intersection = getTokensAllowed(blockchain);
        cartRent.map((item) => {
          intersection = intersection.filter((element) =>
            item?.tokens
              ?.map((item) => item.toLowerCase())
              ?.includes(element.address.toLowerCase()),
          );
        });
        intersection = intersection.filter((item) =>
          rent?.tokens?.includes(item.address),
        );

        if (intersection.length > 0) {
          dispatch(
            addCartRent({
              ...rent,
              quantity: 1,
            }),
          );
        } else {
          toast.error("Please select sales with the same currency");
        }
      } else {
        dispatch(
          addCartRent({
            ...rent,
            quantity: 1,
          }),
        );
      }
    } else {
      router.push("/login");
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    dispatch(
      removeFromCart({
        id: rent.id,
      }),
    );
  };

  const handleChecked = (e) => {
    e.preventDefault();
    if (cartRent.filter((e) => e.id === rent.id).length > 0) {
      dispatch(
        removeFromCart({
          id: rent.id,
        }),
      );
    } else {
      dispatch(
        addCart({
          ...rent,
          quantity: 1,
        }),
      );
    }
  };

  return (
    <div
      className="pb-6 relative"
      onMouseOver={() => setHoverAll(true)}
      onMouseLeave={() => setHoverAll(false)}
    >
      <Link href={`/rent/${rent.id}`}>
        <div
          className={clsx(
            "rounded-xl flex flex-col text-gray-100 lg:w-96 w-64 bg-secondary relative overflow-hidden border border-gray-500 z-[2] cursor-pointer",
            {
              "!border-green-button":
                cartRent.filter((e) => e.id === rent.id).length > 0,
            },
            // Styles.cardHover,
            classes?.root,
          )}
        >
          <img
            src={icon || Icons.logo}
            className="absolute top-[-20%] bottom-0 left-[-40%] right-0 margin-auto opacity-50 min-w-[175%]"
            alt=""
          />
          <div className="flex flex-col relative">
            <div className="w-full flex flex-col text-xs gap-1">
              <div className="w-full lg:text-lg text-md flex justify-between rounded-xl p-2 bg-secondary">
                <span>
                  Card #
                  {rent.id !== undefined ? rent.nftId + "-" + rent.id : "12345"}
                </span>
                <div className="rounded-md bg-white font-bold !text-overlay text-sm px-2 flex items-center justify-center">
                  For Rent
                </div>
              </div>
            </div>
            <div className="w-full lg:h-80 h-48 flex justify-center items-center my-6 relative">
              <div
                className={clsx(
                  { "opacity-0": !hoverAll },
                  "flex flex-col items-end transition-all duration-500 justify-center gap-4 top-4 right-3 absolute",
                )}
              >
                {rent?.status == 0 && (
                  <div
                    onMouseOver={() => setHoverBuy(true)}
                    onMouseLeave={() => setHoverBuy(false)}
                    className={clsx(
                      "rounded-full p-2 flex w-10 h-10 items-center justify-center border-overlay-border border cursor-pointer",
                      {
                        "gap-1 !w-20 px-3 text-center":
                          hoverBuy &&
                          cartRent.filter((e) => e.id === rent.id).length ==
                            0 &&
                          parseInt(rent.amount) > 1,
                      },
                      {
                        "hover:bg-red-500 bg-green-button hover:transition-all transition-all duration-500 hover:duration-500":
                          cartRent.filter((e) => e.id === rent.id).length > 0,
                      },
                      {
                        "bg-overlay hover:bg-overlay-2 hover:transition-all transition-all duration-500 hover:duration-500":
                          cartRent.filter((e) => e.id === rent.id).length == 0,
                      },
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    {cartRent.filter((e) => e.id === rent.id).length > 0 ? (
                      hoverBuy ? (
                        <XIcon className="!w-6" onClick={handleRemove} />
                      ) : (
                        <CheckIcon className="!w-6" onClick={handleChecked} />
                      )
                    ) : (
                      <>
                        <PlusIcon
                          width={"20px"}
                          className="shrink-0"
                          onClick={handleAdd}
                        />
                      </>
                    )}
                  </div>
                )}
                <div
                  className={clsx(
                    "rounded-full w-10 h-10 p-2 bg-overlay border-overlay-border border cursor-pointer hover:bg-overlay-2",
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(0);
                    router.push("/marketplace?search=" + name);
                  }}
                >
                  <SearchIcon />
                </div>
              </div>
              <img
                src={icon || Icons.logo}
                className={icon ? "lg:h-64 h-48" : "h-24"}
                alt={rent.name}
              />
            </div>
            <div className="flex flex-col rounded-xl bg-secondary w-full px-4 pb-3 relative">
              <div className="flex lg:text-lg text-md font-bold text-left py-2 ">
                <div className="lg:w-40 w-20 relative">
                  <img
                    src="icons/card_logo.svg"
                    className="lg:w-40 w-20 absolute lg:top-[-60px] top-[-30px]"
                    alt=""
                  />
                </div>
                <div className="w-full flex flex-col">
                  <span className="uppercase text-white lg:text-lg text-md">
                    {name || "Enders Gate"}
                  </span>
                  <span
                    className="lg:text-[12px] text-[10px] text-gray-500 font-medium"
                    style={{ lineHeight: "10px" }}
                  >
                    Owner: {<AddressText text={rent?.seller} /> || "Owner"}
                  </span>
                </div>
                <img
                  src={Icons.logo}
                  className="lg:w-10 lg:h-10 w-8 h-8"
                  alt=""
                />
              </div>
              {rent?.price && (
                <div
                  className="flex justify-between text-md text-white"
                  style={{ lineHeight: "18px" }}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={`/images/${rent.blockchain}.png`}
                      className="lg:h-8 lg:w-8 w-6 h-6"
                      alt=""
                    />
                    <div className="flex flex-col lg:text-md text-sm font-medium">
                      <p>Price:</p>
                      <span>{formatPrice(rent?.price, rent.blockchain)}</span>
                    </div>
                  </div>
                  <div className="flex lg:text-md items-center gap-2 text-sm font-medium">
                    {getTokensAllowed(rent.blockchain)
                      .filter((item) => {
                        return rent?.tokens
                          ?.map((token) => token.toLowerCase())
                          ?.includes(item.address.toLowerCase());
                      })
                      .map((item) => (
                        <img
                          src={item.logo}
                          className="w-6 h-6 rounded-full"
                          alt=""
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {rent?.status == 0 && (
        <div
          className={clsx(
            { "bottom-[8px]": hoverAll },
            { "bottom-[50px]": !hoverAll },
            "flex w-full gap-4 absolute transition-all duration-500  px-8 z-[1]  font-bold text-white",
          )}
        >
          <Link
            href={`/rent/${rent.id}`}
            className="w-1/2 px-2 pb-1 flex justify-center items-center rounded-b-md pt-10 border border-overlay-border cursor-pointer hover:bg-green-button hover:!text-overlay transition-all duration-500"
          >
            Rent Now
          </Link>
          <Link
            href={`/rent/${rent.id}`}
            className="w-1/2 px-2 pb-1  flex justify-center items-center rounded-b-md pt-10 border border-overlay-border cursor-pointer hover:bg-overlay-2 transition-all duration-500"
          >
            Details
          </Link>
        </div>
      )}
    </div>
  );
};
