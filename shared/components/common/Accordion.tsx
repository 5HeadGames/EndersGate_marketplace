import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import React, { useState } from "react";

const AccordionMenu: any = ({ title, children }) => {
  return (
    <div className="flex flex-col w-full bg-overlay py-6">
      <div className="p-2 cursor-pointer border-overlay-border justify-between flex">
        <p className="text-sm font-bold text-white"> {title}</p>{" "}
      </div>
      <div
        className={clsx(
          " transition-all ease-out duration-500 overflow-hidden flex items-center",
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default AccordionMenu;
