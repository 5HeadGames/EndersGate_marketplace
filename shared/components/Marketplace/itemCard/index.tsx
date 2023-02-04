import React from "react";
import clsx from "clsx";
import { Icons } from "@shared/const/Icons";
import Link from "next/link";
import Styles from "./styles.module.scss";
import Web3 from "web3";
import { AddressText } from "@shared/components/common/specialFields/SpecialFields";
import { useAppDispatch } from "@redux/store";
import { useSelector } from "react-redux";
import { XIcon } from "@heroicons/react/outline";
import {
  CheckCircleIcon,
  CheckIcon,
  PlusIcon,
  SearchIcon,
} from "@heroicons/react/solid";
import { addCart, removeFromCart } from "@redux/actions";
import { useRouter } from "next/router";
import { Input } from "@shared/components/common/form/input";
import { useForm } from "react-hook-form";
import { useToasts } from "react-toast-notifications";
import { getTokensAllowed } from "@shared/web3";
import Sales from "@shared/components/Profile/sales/sales";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  classes?: Partial<Record<"root", string>>;
  icon?: string;
  id: any;
  tokens?: any;
  transactionId?: any;
  name?: any;
  balance?: any;
  price?: any;
  byId: boolean;
  seller?: string;
  type?: string;
  sale?: any;
  setPage?: any;
}

const NFTCard: React.FunctionComponent<Props> = (props) => {
  const { classes, ...rest } = props;
  const dispatch = useAppDispatch();
  const { cart, user } = useSelector((state: any) => state.layout);
  const [hoverAll, setHoverAll] = React.useState(false);
  const [hoverBuy, setHoverBuy] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const { addToast } = useToasts();

  return (
    <>
      {props.byId ? (
        <Link href={`/NFTDetailID/${props.id}`}>
          <div
            className={clsx(
              "rounded-xl flex flex-col text-gray-100 w-96 bg-secondary cursor-pointer relative overflow-hidden border border-gray-500 ",
              Styles.cardHover,
              classes?.root,
            )}
          >
            <img
              src={props.icon || Icons.logo}
              className="absolute top-[-20%] bottom-0 left-[-40%] right-0 margin-auto opacity-50 min-w-[175%]"
              alt=""
            />
            <div className="flex flex-col relative h-full justify-between">
              <div className="w-full flex flex-col text-xs gap-1">
                <div className="w-full text-lg flex justify-between rounded-xl p-2 bg-secondary">
                  <span>
                    Card #{props.id !== undefined ? props.id : "12345"}
                  </span>
                  {props.balance && <span>x{props.balance}</span>}
                </div>
              </div>
              <div className="w-full h-72 flex justify-center items-center my-6">
                <img
                  src={props.icon || Icons.logo}
                  className={props.icon ? "h-64" : "h-24"}
                />
              </div>
              <div className="flex flex-col rounded-xl bg-secondary w-full px-4 pb-3 relative">
                <div className="flex text-lg font-bold text-left py-2 ">
                  <div className="w-40 relative">
                    <img
                      src={Icons.logoCard}
                      className="w-40 absolute top-[-60px]"
                      alt=""
                    />
                  </div>
                  <div className="w-full flex flex-col justify-center">
                    <span className="uppercase text-white text-lg">
                      {props.name || "Enders Gate"}
                    </span>
                    {props.seller ? (
                      <span
                        className="text-[12px] text-gray-500 font-medium"
                        style={{ lineHeight: "10px" }}
                      >
                        Owner: {<AddressText text={props.seller} /> || "Owner"}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <img src={Icons.logo} className="w-10 h-10" alt="" />
                </div>
                {props.price && (
                  <div className="flex justify-between text-md text-white ">
                    <div className="flex items-center gap-2">
                      <img
                        src="/icons/POLYGON.svg"
                        className="h-8 w-8"
                        alt=""
                      />
                      <div className="flex flex-col text-md font-medium">
                        <p>Price:</p>
                        <span>
                          {Web3.utils.fromWei(props.price, "ether")} MATIC
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col text-md font-medium">
                      <p>Highest Bid:</p>
                      <span>
                        {Web3.utils.fromWei(props.price, "ether")} MATIC
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div
          className="pb-6 relative"
          onMouseOver={() => setHoverAll(true)}
          onMouseLeave={() => setHoverAll(false)}
        >
          <Link href={`/NFTDetailSale/${props.transactionId}`}>
            <div
              className={clsx(
                "rounded-xl flex flex-col text-gray-100 lg:w-96 w-64 bg-secondary relative overflow-hidden border border-gray-500 z-[2] cursor-pointer",
                {
                  ["!border-green-button"]:
                    cart.filter((e) => e.id === props.transactionId).length > 0,
                },
                // Styles.cardHover,
                classes?.root,
              )}
            >
              <img
                src={props.icon || Icons.logo}
                className="absolute top-[-20%] bottom-0 left-[-40%] right-0 margin-auto opacity-50 min-w-[175%]"
                alt=""
              />
              <div className="flex flex-col relative">
                <div className="w-full flex flex-col text-xs gap-1">
                  <div className="w-full lg:text-lg text-md flex justify-between rounded-xl p-2 bg-secondary">
                    <span>
                      Card #
                      {props.id !== undefined
                        ? props.id + "-" + props.transactionId
                        : "12345"}
                    </span>
                    {props.sale.amount && <span>x{props.sale.amount}</span>}
                    {/* {<span>#{props.transactionId}</span>} */}
                  </div>
                </div>
                <div className="w-full lg:h-80 h-48 flex justify-center items-center my-6 relative">
                  <div
                    className={clsx(
                      { ["opacity-0"]: !hoverAll },
                      "flex flex-col items-end transition-all duration-500 justify-center gap-4 top-4 right-3 absolute",
                    )}
                  >
                    {" "}
                    {props.sale.status == 0 &&
                      Math.floor(new Date().getTime() / 1000) <=
                        parseInt(props.sale?.duration) +
                          parseInt(props.sale?.startedAt) && (
                        <div
                          onMouseOver={() => setHoverBuy(true)}
                          onMouseLeave={() => setHoverBuy(false)}
                          className={clsx(
                            "rounded-full p-2 flex w-10 h-10 items-center justify-center border-overlay-border border cursor-pointer",
                            {
                              ["gap-1 !w-20 px-3 text-center"]:
                                hoverBuy &&
                                cart.filter((e) => e.id === props.transactionId)
                                  .length == 0 &&
                                parseInt(props.sale.amount) > 1,
                            },
                            {
                              ["hover:bg-red-500 bg-green-button hover:transition-all transition-all duration-500 hover:duration-500"]:
                                cart.filter((e) => e.id === props.transactionId)
                                  .length > 0,
                            },
                            {
                              ["bg-overlay hover:bg-overlay-2 hover:transition-all transition-all duration-500 hover:duration-500"]:
                                cart.filter((e) => e.id === props.transactionId)
                                  .length == 0,
                            },
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          {cart.filter((e) => e.id === props.transactionId)
                            .length > 0 ? (
                            hoverBuy ? (
                              <XIcon
                                className="!w-6"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (
                                    cart.filter(
                                      (e) => e.id === props.transactionId,
                                    ).length > 0
                                  ) {
                                    dispatch(
                                      removeFromCart({
                                        id: props.transactionId,
                                      }),
                                    );
                                  } else {
                                    dispatch(
                                      addCart({
                                        ...props.sale,
                                        quantity: quantity,
                                      }),
                                    );
                                  }
                                }}
                              />
                            ) : (
                              <CheckIcon
                                className="!w-6"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (
                                    cart.filter(
                                      (e) => e.id === props.transactionId,
                                    ).length > 0
                                  ) {
                                    dispatch(
                                      removeFromCart({
                                        id: props.transactionId,
                                      }),
                                    );
                                  } else {
                                    dispatch(
                                      addCart({
                                        ...props.sale,
                                        quantity: quantity,
                                      }),
                                    );
                                  }
                                }}
                              />
                            )
                          ) : (
                            <>
                              <PlusIcon
                                width={"20px"}
                                className="shrink-0"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (user?.ethAddress) {
                                    if (
                                      cart.filter(
                                        (e) => e.id === props.transactionId,
                                      ).length > 0
                                    ) {
                                      dispatch(
                                        removeFromCart({
                                          id: props.transactionId,
                                        }),
                                      );
                                    } else {
                                      let intersection = getTokensAllowed();
                                      cart.map((item) => {
                                        intersection = intersection.filter(
                                          (element) =>
                                            item.tokens
                                              .map((item) => item.toLowerCase())
                                              .includes(
                                                element.address.toLowerCase(),
                                              ),
                                        );
                                      });
                                      if (intersection.length > 0) {
                                        dispatch(
                                          addCart({
                                            ...props.sale,
                                            quantity: quantity,
                                          }),
                                        );
                                      } else {
                                        addToast(
                                          "Please select sales with the same currency",
                                          { appearance: "error" },
                                        );
                                      }
                                    }
                                  } else {
                                    router.push("/login");
                                  }
                                }}
                              />

                              <Input
                                type="number"
                                register={register}
                                name="quantity"
                                classNameContainer={clsx(
                                  "!border-none ourline-none w-8 text-sm !p-0",
                                )}
                                className={clsx(
                                  {
                                    ["!hidden"]:
                                      !hoverBuy ||
                                      parseInt(props.sale.amount) <= 1,
                                  },
                                  "!p-0",
                                )}
                                withoutX
                                onClick={(e) => e.preventDefault()}
                                max={props.sale.amount}
                                min={1}
                                defaultValue={quantity}
                                value={quantity}
                                onChange={(e) => {
                                  if (
                                    parseInt(e.target.value) >
                                    parseInt(props.sale.amount)
                                  ) {
                                    addToast(
                                      "Your amount exceeds the amount of NFTs of the sale",
                                      { appearance: "error" },
                                    );
                                  } else {
                                    setQuantity(parseInt(e.target.value));
                                  }
                                }}
                              ></Input>
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
                        props.setPage(0);
                        router.push("/marketplace?search=" + props.name);
                      }}
                    >
                      <SearchIcon />
                    </div>
                  </div>
                  <img
                    src={props.icon || Icons.logo}
                    className={props.icon ? "lg:h-64 h-48" : "h-24"}
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
                        {props.name || "Enders Gate"}
                      </span>
                      <span
                        className="lg:text-[12px] text-[10px] text-gray-500 font-medium"
                        style={{ lineHeight: "10px" }}
                      >
                        Owner: {<AddressText text={props.seller} /> || "Owner"}
                      </span>
                    </div>
                    <img
                      src={Icons.logo}
                      className="lg:w-10 lg:h-10 w-8 h-8"
                      alt=""
                    />
                  </div>
                  {props.price && (
                    <div
                      className="flex justify-between text-md text-white"
                      style={{ lineHeight: "18px" }}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src="/icons/POLYGON.svg"
                          className="lg:h-8 lg:w-8 w-6 h-6"
                          alt=""
                        />
                        <div className="flex flex-col lg:text-md text-sm font-medium">
                          <p>Price:</p>
                          <span>{parseInt(props.price) / 10 ** 6} USD</span>
                        </div>
                      </div>
                      <div className="flex lg:text-md items-center gap-2 text-sm font-medium">
                        {getTokensAllowed()
                          .filter((item) => {
                            return props?.tokens
                              .map((token) => token.toLowerCase())
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

          {props.sale.status == 0 &&
            Math.floor(new Date().getTime() / 1000) <=
              parseInt(props.sale?.duration) +
                parseInt(props.sale?.startedAt) && (
              <div
                className={clsx(
                  { ["bottom-[8px]"]: hoverAll },
                  { ["bottom-[50px]"]: !hoverAll },
                  "flex w-full gap-4 absolute transition-all duration-500  px-8 z-[1]  font-bold text-white",
                )}
              >
                <div
                  onClick={() => {}}
                  className="w-1/2 px-2 pb-1 flex justify-center items-center rounded-b-md pt-10 border border-overlay-border cursor-pointer hover:bg-green-button hover:text-overlay transition-all duration-500"
                >
                  Buy Now
                </div>
                <Link href={`/NFTDetailSale/${props.transactionId}`}>
                  <div className="w-1/2 px-2 pb-1  flex justify-center items-center rounded-b-md pt-10 border border-overlay-border cursor-pointer hover:bg-overlay-2 transition-all duration-500">
                    Details
                  </div>
                </Link>
              </div>
            )}
        </div>
      )}
    </>
  );
};

export default NFTCard;
