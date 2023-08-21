import React from "react";
import clsx from "clsx";
import { Icons } from "@shared/const/Icons";
import Link from "next/link";
import Styles from "./styles.module.scss";
import Web3 from "web3";
import { AddressText } from "@shared/components/common/specialFields/SpecialFields";
import { formatPrice } from "@shared/utils/formatPrice";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  classes?: Partial<Record<"root", string>>;
  icon?: string;
  id: any;
  transactionId?: any;
  name?: any;
  balance?: any;
  price?: any;
  byId: boolean;
  seller?: string;
  onTimeChange?: any;
  sale?: any;
  blockchain?: any;
}

const NFTCardSlider: React.FunctionComponent<Props> = (props) => {
  const { classes, ...rest } = props;

  const [hoverAll, setHoverAll] = React.useState(false);

  return (
    <>
      {props.byId ? (
        <Link href={`/card/${props.id}`}>
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
            <div className="flex flex-col relative">
              <div className="w-full flex flex-col text-xs gap-1">
                <div className="w-full text-lg flex justify-between rounded-xl p-2 bg-secondary">
                  <span>
                    Card #{props.id !== undefined ? props.id : "12345"}
                  </span>
                  {props.balance && <span>x{props.balance}</span>}
                </div>
              </div>
              <div className="w-full h-56 flex justify-center items-center my-6">
                <img
                  src={props.icon || Icons.logo}
                  className={props.icon ? "h-40" : "h-24"}
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
                          {formatPrice(props.price, props.blockchain)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col text-md font-medium">
                      <p>Highest Bid:</p>
                      <span>{formatPrice(props.price, props.blockchain)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div
          className="hover:pb-7 transition-all duration-1000 relative"
          onMouseOver={() => setHoverAll(true)}
          onMouseLeave={() => setHoverAll(false)}
        >
          <Link href={`/sale/${props.transactionId}`}>
            <div
              className={clsx(
                "rounded-xl flex flex-col text-gray-100 w-72 bg-secondary cursor-pointer relative overflow-hidden border z-[2] border-gray-500 hover:border-green-button transition duration-500",
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
                  <div className="w-full text-sm flex justify-between rounded-xl p-1 px-4 bg-secondary">
                    <span>
                      Card #{props.id !== undefined ? props.id : "12345"}
                    </span>
                    {props.balance && <span>x{props.balance}</span>}
                    {<span>#{props.transactionId}</span>}
                  </div>
                </div>
                <div className="w-full h-40 flex justify-center items-center my-6">
                  <img
                    src={props.icon || Icons.logo}
                    className={props.icon ? "h-40" : "h-24"}
                  />
                </div>
                <div className="flex flex-col rounded-t-xl bg-secondary w-full px-4 pb-1 relative">
                  <div className="flex text-md font-bold text-left py-2 ">
                    <div className="w-32 relative">
                      <img
                        src="icons/card_logo.svg"
                        className="w-32 absolute top-[-45px]"
                        alt=""
                      />
                    </div>
                    <div className="w-full flex flex-col">
                      <span className="uppercase text-white text-sm">
                        {props.name || "Enders Gate"}
                      </span>
                      <span
                        className="text-[10px] text-gray-500 font-medium"
                        style={{ lineHeight: "10px" }}
                      >
                        Owner: {<AddressText text={props.seller} /> || "Owner"}
                      </span>
                    </div>
                    <img src={Icons.logo} className="w-8 h-8" alt="" />
                  </div>
                  {props.price && (
                    <div
                      className="flex justify-between text-[11px] text-white "
                      style={{ lineHeight: "18px" }}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src="/icons/POLYGON.svg"
                          className="h-8 w-8"
                          alt=""
                        />
                        <div className="flex flex-col text-[12px] font-medium">
                          <p>Price:</p>
                          <span>
                            {formatPrice(props.price, props.blockchain)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col text-[12px] font-medium">
                        <p>Highest Bid:</p>
                        <span>
                          {formatPrice(props.price, props.blockchain)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex rounded-b-xl h-2 bg-secondary w-full">
                  {/* <div
                  className={clsx(
                    {
                      ["w-[100%] duration-[4000ms] transition-all "]:
                        props.onTimeChange,
                    },
                    { ["w-[0%]"]: !props.onTimeChange },
                    `bg-primary-disabled`,
                  )}
                ></div> */}
                </div>
              </div>
            </div>
          </Link>

          {props?.sale?.status == 0 &&
            Math.floor(new Date().getTime() / 1000) <=
              parseInt(props.sale?.duration) +
                parseInt(props.sale?.startedAt) && (
              <div
                className={clsx(
                  { ["bottom-[0px]"]: hoverAll },
                  { ["bottom-[50px]"]: !hoverAll },
                  "flex w-full gap-2 absolute transition-all duration-500  px-2 z-[1]  font-bold text-white",
                )}
              >
                <Link href={`/sale/${props.transactionId}`}>
                  <div
                    onClick={() => {}}
                    className="w-1/2 px-2 pb-1 flex text-sm justify-center items-center rounded-b-md pt-10 border border-overlay-border cursor-pointer bg-overlay hover:bg-green-button hover:text-overlay transition-all duration-500"
                  >
                    Buy Now
                  </div>
                </Link>
                <Link href={`/sale/${props.transactionId}`}>
                  <div className="w-1/2 px-2 pb-1 text-sm flex justify-center items-center rounded-b-md pt-10 border border-overlay-border cursor-pointer bg-overlay hover:bg-overlay-2 transition-all duration-500">
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

export default NFTCardSlider;
