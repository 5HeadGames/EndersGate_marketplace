/* eslint-disable react-hooks/exhaustive-deps */
import { XIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import useMagicLink from "@shared/hooks/useMagicLink";

import React, { useCallback, useState, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { formatPrice } from "@shared/utils/formatPrice";
import { CHAINS, CHAIN_IDS_BY_NAME } from "../../utils/chains";
import { Icons } from "@shared/const/Icons";
import {
  checkFirebaseInfluencerCode,
  getNativeBlockchain,
  hasAggregatorFeed,
} from "@shared/web3";
import AccordionMenu from "./Accordion";
import { Input } from "./form/input";
import { Button } from "./button";
import { LoadingOutlined, WalletOutlined } from "@ant-design/icons";
import { useUser } from "@shared/context/useUser";

export const useCartModal = () => {
  const dispatch = useDispatch();

  const [isShow, setIsShow] = useState(false);
  const cancelButtonRef = useRef<HTMLDivElement>(null);

  const hide = () => {
    setIsShow(false);
  };

  const show = () => {
    setIsShow(true);
  };

  const Modal = useCallback(
    ({
      cart,
      removeAll,
      messageBuy,
      itemsCart,
      priceMatic,
      tokensAllowed,
      tokenSelected,
      setTokenSelected,
      buy,
      loading = false,
      providerName,
      user,
      blockchain,
      isShow,
      handleSubmit,
      errors,
      isValidCode,
    }) => {
      console.log(blockchain, "blockchain");

      return (
        <Transition.Root show={isShow} as={Fragment}>
          <Dialog
            as="div"
            static
            className="fixed inset-0 overflow-y-auto"
            style={{
              zIndex: 10,
            }}
            initialFocus={cancelButtonRef}
            open={isShow}
            onClose={hide}
          >
            <div className="flex items-center justify-center pb-20 pt-4 min-h-screen text-center sm:block sm:p-0 bg-overlay-2">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-transparent-45 transition-opacity" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="inline-block align-bottom text-left rounded-20 shadow-md transform transition-all sm:align-middle w-max sm:max-w-6xl">
                  <div className="flex flex-col gap-4 bg-overlay sm:p-4 p-2 rounded-xl border border-transparent-color-gray-200 relative shadow-inner mt-24">
                    <div className="text-white absolute top-2 right-2">
                      <XIcon
                        onClick={hide}
                        className="w-6 h-6 cursor-pointer"
                      ></XIcon>
                    </div>
                    <div className="text-center text-xl font-bold text-white">
                      Cart
                    </div>
                    {cart.length ? (
                      <form
                        onSubmit={handleSubmit(buy)}
                        className="flex flex-col items-center border border-transparent-color-gray-200 rounded-xl xl:min-w-[800px] lg:min-w-[650px] md:min-w-[500px] md:w-max py-2"
                      >
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
                        <div className="sm:px-4 px-1 py-2 pb-4 gap-2 flex flex-col items-center w-full">
                          {itemsCart.map((item: any, index: any) => {
                            return item;
                          })}
                        </div>
                        {!getNativeBlockchain(blockchain) && (
                          <>
                            <div className="text-md text-white font-bold w-full text-center">
                              Chose currency
                            </div>
                            <div className="flex  gap-4 pb-4 w-full flex-wrap items-center justify-center shadow-inner">
                              {tokensAllowed?.map((item: any, index: any) => {
                                return (
                                  <div
                                    className={clsx(
                                      "w-24 flex items-center justify-center gap-1 rounded-xl cursor-pointer py-1 border border-white",

                                      {
                                        "bg-transparent-color-gray-200 border-none":
                                          tokenSelected.address !==
                                          item.address,
                                      },
                                      {
                                        "bg-overlay border-green-button shadow-[0_0px_10px] shadow-green-button":
                                          tokenSelected.address ===
                                          item.address,
                                      },
                                    )}
                                    onClick={() => {
                                      setTokenSelected(item);
                                    }}
                                  >
                                    <img
                                      src={item.logo}
                                      className="w-6 h-6"
                                      alt=""
                                    />
                                    <h2 className="text-white text-sm font-bold">
                                      {item.name}
                                    </h2>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}
                        <div className="flex gap-6 justify-between items-center text-md text-xl py-2 px-8 border-y border-transparent-color-gray-200 bg-transparent w-full">
                          <div className="flex gap-1 items-center">
                            <img src={Icons.logo} className="w-8 h-8" alt="" />
                            <h3
                              className="text-[12px] text-primary-disabled font-[700]"
                              style={{ lineHeight: "14px" }}
                            >
                              Total price on <br />
                              <span className="text-red-primary font-bold">
                                5
                              </span>
                              <span className="text-white font-bold">HG</span>{" "}
                              Shop:
                            </h3>
                          </div>
                          <div className="flex flex-col gap items-end">
                            {!getNativeBlockchain(blockchain) && (
                              <h3
                                className="text-sm font-[700] text-white flex gap-1 items-center justify-center"
                                style={{ fontSize: "14px" }}
                              >
                                {hasAggregatorFeed(blockchain) ? (
                                  <>
                                    {priceMatic}{" "}
                                    {
                                      CHAINS[CHAIN_IDS_BY_NAME[blockchain]]
                                        ?.nativeCurrency?.symbol
                                    }{" "}
                                  </>
                                ) : (
                                  <>
                                    {formatPrice(
                                      cart
                                        ?.map((item: any, i: any) =>
                                          (
                                            BigInt(item.price) *
                                            BigInt(item.quantity)
                                          ).toString(),
                                        )
                                        .reduce((item: any, acc: any) => {
                                          return BigInt(item) + BigInt(acc);
                                        }),
                                      blockchain,
                                    )}
                                  </>
                                )}
                                <img
                                  src={`/images/${blockchain}.png`}
                                  className="w-3 h-3"
                                  alt=""
                                />
                              </h3>
                            )}
                            {!getNativeBlockchain(blockchain) && (
                              <h3
                                className="text-sm font-[700] text-white opacity-50"
                                style={{ fontSize: "14px" }}
                              >
                                (
                                {formatPrice(
                                  cart
                                    ?.map((item: any, i: any) =>
                                      (
                                        BigInt(item.price) *
                                        BigInt(item.quantity)
                                      ).toString(),
                                    )
                                    .reduce((item: any, acc: any) => {
                                      return BigInt(item) + BigInt(acc);
                                    }),
                                  blockchain,
                                )}
                                )
                              </h3>
                            )}
                          </div>
                        </div>

                        {messageBuy !== "" ? (
                          <div className="py-2 text-lg text-white font-bold text-center w-full">
                            {messageBuy}
                          </div>
                        ) : (
                          ""
                        )}
                        {/* {router && router.asPath == "/shop" && (
                          <>
                            <AccordionMenu title="Promo Code / Referral">
                              <div className="flex items-start justify-center gap-4 w-full px-14 relative">
                                {!errors.influencer_code && isValidCode ? (
                                  <img
                                    src="/icons/check.png"
                                    className="w-8 absolute left-3 top-1"
                                    alt=""
                                  />
                                ) : errors.influencer_code && !isValidCode ? (
                                  <img
                                    src="/icons/x.png"
                                    className="w-8 absolute left-3 top-1"
                                    alt=""
                                  />
                                ) : (
                                  ""
                                )}
                                <div className="flex flex-col gap-2 w-full">
                                  <Input
                                    name="influencer_code"
                                    register={register}
                                    classNameContainer={clsx(
                                      "text-sm px-3 py-1 text-white w-full bg-transparent rounded-lg border border-overlay-overlay font-bold placeholder:text-white placeholder:font-bold outline-none",
                                    )}
                                    disabled={isValidCode}
                                    withoutX
                                    placeholder="Put your code here!"
                                    error={errors && errors.influencer_code}
                                  ></Input>
                                  {!errors.influencer_code && isValidCode && (
                                    <p className="text-green-button text-sm font-bold">
                                      Code added for a Free “Influencer Name”
                                      Virtual Collectable Trading Card!
                                    </p>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={
                                    isValidCode
                                      ? () => {
                                          setValidCode(false);
                                        }
                                      : async () => {
                                          const value =
                                            getValues("influencer_code");
                                          const validCode =
                                            await checkFirebaseInfluencerCode({
                                              influencer_code: value,
                                              setError,
                                              clearErrors,
                                            });
                                          if (validCode) {
                                            setValidCode(true);
                                          } else {
                                            setValidCode(false);
                                          }
                                        }
                                  }
                                  className={clsx(
                                    {
                                      "mb-3":
                                        errors.influencer_code || isValidCode,
                                    },
                                    "bg-red-600 py-2 px-6 text-white font-bold rounded-md cursor-pointer border-none outline-none",
                                  )}
                                >
                                  {!isValidCode ? "Apply" : "Remove"}
                                </button>
                              </div>
                            </AccordionMenu>
                          </>
                        )} */}
                        <div className="w-full flex items-center justify-center py-2">
                          <Button
                            type="submit"
                            // disabled={errors.influencer_code && !isValidCode}
                            decoration="fillGreen"
                            className={
                              "w-auto px-6 py-2 flex justify-center items-center rounded-xl !font-bold"
                            }
                          >
                            {loading ? (
                              <LoadingOutlined />
                            ) : (
                              "Complete Purchase"
                            )}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-white font-bold gap-4 text-md text-center w-64 p-4 border border-transparent-color-gray-200 rounded-xl">
                        <img
                          src={"icons/logo.png"}
                          className="w-20 h-20"
                          alt=""
                        />
                        There aren't items in your cart.
                      </div>
                    )}
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      );
    },
    [],
  );

  return { Modal, hide, isShow, show };
};
