"use client";
import * as React from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { InputEmail } from "../form/input-email";
import { Button } from "../button";
import { Icons } from "@shared/const/Icons";

export const Footer = () => {
  const items = [
    // "JOB APPLICATIONS",
    { name: "ABOUT", link: "https://www.linkedin.com/company/5headgames" },
    { name: "CONTACT US", link: "mailto:support@5headgames.com" },
    {
      name: "WHITEPAPER",
      link: "https://endersgate.gitbook.io/endersgate/welcome/master",
    },
    { name: "5HG LEGAL", link: "https://www.endersgate.gg/legal" },
  ];
  return (
    <div
      className={clsx(
        "w-full flex flex-col items-center py-16 gap-6 xl:px-10 px-4 border-t border-overlay-border bg-overlay",
      )}
    >
      <img className="h-12" src={Icons.logo5HG} alt="logo" />
      <div className="flex md:flex-row flex-col flex-wrap lg:justify-start justify-center items-center gap-y-4">
        {items.map(({ name, link }, i) => (
          <>
            <a
              href={link}
              className={clsx(
                "px-2 text-xl font-bold text-primary-disabled text-center",
              )}
            >
              {name}
            </a>
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
          Entertaiment For Digital Collectors
        </p>
        {/* <a
          href="https://www.5headgames.com"
          className={clsx(
            "px-2 text-xl font-bold text-primary-disabled hover:text-red-primary",
          )}
        >
          5headgames.com
        </a> */}
      </div>
      <p className="text-primary-disabled text-[11px] text-center">
        ©2023 5HEADGAMES, INC. ALL RIGHTS RESERVED.
        <br /> All trademarks referenced herein are the properties of their
        respective owners.{" "}
      </p>
      <p className="text-primary-disabled text-[13px] text-center mt-10">
        MARKETPLACE BUILT BY 5HEADGAMES
      </p>
    </div>
  );
};
