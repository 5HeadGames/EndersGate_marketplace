"use client";
import { AddressText } from "@shared/components/common/specialFields/SpecialFields";
import { Icons } from "@shared/const/Icons";
import { useBlockchain } from "@shared/context/useBlockchain";
import clsx from "clsx";
import Link from "next/link";
import Web3 from "web3";
import Styles from "../styles.module.scss";

export const InventoryCard = (props) => {
  const { classes } = props;
  const { blockchain } = useBlockchain();
  return (
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
        <div className="flex flex-col relative h-full justify-between">
          <div className="w-full flex flex-col text-xs gap-1">
            <div className="w-full text-lg flex justify-between rounded-xl p-2 bg-secondary">
              <span>Card #{props.id !== undefined ? props.id : "12345"}</span>
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
                    src={`/images/${blockchain}.png`}
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
                  <span>{Web3.utils.fromWei(props.price, "ether")} MATIC</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
