import * as React from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { InputEmail } from "../form/input-email";
import { Button } from "../button";

export const GetStarted = () => {
  return (
    <div
      className={clsx(
        "w-full flex flex-col items-center xl:py-10 py-6 gap-10 px-10 border-t border-overlay-border",
      )}
    >
      <h2 className="text-white text-xl font-bold">
        It's <span className="text-red-primary">easy</span> to get started!
        Here's how,
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-10">
        <div className="flex flex-col items-center text-white gap-2 w-[300px]">
          <img src="/icons/getStarted2.svg" className="w-10" alt="" />
          <h3 className="text-xl font-bold">Set up your wallet</h3>
          <p className="text-md text-center">
            Set up your wallet, connect it to the Marketplace by clicking my
            account and selecting connect my wallet option. <br />
            <br />
            <a className="text-red-primary" href="" target={"_blank"}>
              {" "}
              Learn about the wallets we support here
            </a>
          </p>
        </div>
        <div className="flex flex-col items-center text-white gap-2 w-[300px]">
          <img src="/icons/getStarted3.svg" className="w-10" alt="" />
          <h3 className="text-xl font-bold">Explore in the markeplace</h3>
          <p className="text-md text-center">
            Click the{" "}
            <a className="text-red-primary" href="#browse">
              Browse More Button
            </a>{" "}
            and search the marketplace. <br />
            <br />
            You can buy NFTs, sell them, rent them & much more.
          </p>
        </div>
        <div className="flex flex-col items-center text-white gap-2 w-[300px]">
          <img src="/icons/getStarted1.svg" className="w-10" alt="" />
          <h3 className="text-xl font-bold">List or buy NFTs </h3>
          <p className="text-md text-center">
            Choose between auctions, fixed-price listings, and declining-price
            listings.
          </p>
        </div>
      </div>
    </div>
  );
};
