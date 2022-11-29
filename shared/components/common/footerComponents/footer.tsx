import * as React from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { InputEmail } from "../form/input-email";
import { Button } from "../button";
import { Icons } from "@shared/const/Icons";

export const Footer = () => {
  const items = [
    "JOB APPLICATIONS",
    "ABOUT",
    "CONTACT US",
    "WHITEPAPER",
    "5HG LEGAL",
  ];
  return (
    <div
      className={clsx(
        "w-full flex flex-col items-center py-16 gap-6 px-10 border-t border-overlay-border bg-overlay",
      )}
    >
      <img className="h-12" src={Icons.logo5HG} alt="logo" />
      <div className="flex md:flex-row flex-wrap lg:justify-start justify-center gap-y-4">
        {items.map((item, i) => (
          <>
            <div
              className={clsx("px-2 text-xl font-bold text-primary-disabled")}
            >
              {item}
            </div>
            {i < items.length - 1 && (
              <p
                className={clsx(
                  "lg:block hidden px-2 text-xl font-bold text-primary-disabled",
                )}
              >
                I
              </p>
            )}
          </>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center">
        <p
          className={clsx(
            "px-2 text-xl font-bold text-primary-disabled text-center",
          )}
        >
          QUALITY BLOCKCHAIN GAMES FOR ALL
        </p>
        <a
          href="https://www.5headgames.com"
          className={clsx(
            "px-2 text-xl font-bold text-primary-disabled hover:text-red-primary",
          )}
        >
          5headgames.com
        </a>
      </div>
      <p className="text-overlay-border text-[11px] text-center">
        ©2022 5HEADGAMES, INC. ALL RIGHTS RESERVED.
        <br /> All trademarks referenced herein are the properties of their
        respective owners.{" "}
      </p>
      <p className="text-overlay-border text-[13px] text-center mt-10">
        MARKETPLACE BUILT BY 5HEADGAMES
      </p>
    </div>
  );
};
