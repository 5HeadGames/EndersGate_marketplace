"use client";
import { SearchIcon } from "@heroicons/react/solid";
import { AddressText } from "@shared/components/common/specialFields/SpecialFields";
import { Icons } from "@shared/const/Icons";
import { useBlockchain } from "@shared/context/useBlockchain";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";

export const OpenseaCard = (props) => {
  const { classes } = props;
  const [hoverAll, setHoverAll] = React.useState(false);
  const router = useRouter();
  const { blockchain } = useBlockchain();

  return (
    <div
      className="pb-6 relative"
      onMouseOver={() => setHoverAll(true)}
      onMouseLeave={() => setHoverAll(false)}
    >
      <a
        href={`https://opensea.io/assets/matic/${props.sale.nft}/${props.sale.nftId}`}
        target="_blank"
        rel="noreferrer"
        className={clsx(
          "rounded-xl flex flex-col text-gray-100 lg:w-96 w-64 bg-secondary relative overflow-hidden border border-gray-500 z-[2] cursor-pointer",
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
                {props.sale.nftId !== undefined ? props.sale.nftId : "12345"}
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
                src={Icons.opensea}
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
                    src={`/icons/${blockchain}.svg`}
                    className="lg:h-8 lg:w-8 w-6 h-6"
                    alt=""
                  />
                  <div className="flex flex-col lg:text-md text-sm font-medium">
                    <p>Price:</p>
                    <span>
                      {props.price} {props.currency}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </a>

      {props.sale.status == 0 &&
        Math.floor(new Date().getTime() / 1000) <=
          parseInt(props.sale?.duration) + parseInt(props.sale?.startedAt) && (
          <div
            className={clsx(
              { ["bottom-[8px]"]: hoverAll },
              { ["bottom-[50px]"]: !hoverAll },
              "flex w-full gap-4 absolute transition-all duration-500  px-8 z-[1] items-center justify-center  font-bold text-white",
            )}
          >
            <a
              href={`https://opensea.io/assets/matic/${props.sale.nft}/${props.sale.nftId}`}
              target="_blank"
              className="w-2/3 px-2 pb-1  flex justify-center items-center rounded-b-md pt-10 border border-overlay-border cursor-pointer hover:bg-overlay-2 transition-all duration-500"
            >
              Details
            </a>
          </div>
        )}
    </div>
  );
};
