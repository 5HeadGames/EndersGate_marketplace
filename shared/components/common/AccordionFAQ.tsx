import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import React, { useState } from "react";

const AccordionFAQ: any = ({ title, children }) => {
  const [show, setShow] = React.useState(false);

  return (
    <div className="flex flex-col w-full bg-overlay border border-overlay-border rounded-xl py-6 px-4">
      <div
        className="cursor-pointer justify-between flex items-center"
        onClick={() => {
          setShow((prev) => !prev);
        }}
      >
        <p className="text-lg font-bold text-white">{title}</p>{" "}
        {!show ? (
          <ChevronDownIcon className="text-white w-8" />
        ) : (
          <ChevronUpIcon className="text-white w-8" />
        )}
      </div>
      <div
        className={clsx(
          { hidden: !show },
          "transition-all ease-out duration-500 h-auto overflow-hidden flex items-center text-white pt-4",
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default AccordionFAQ;
