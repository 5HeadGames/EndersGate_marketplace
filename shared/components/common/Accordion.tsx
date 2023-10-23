import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import React, { useState } from "react";

const AccordionMenu: any = ({ title, children }) => {
  const [activeItem, setActiveItem] = useState(false);

  return (
    <div className="flex flex-col w-full bg-overlay">
      <div
        className="p-2 cursor-pointer border-b border-overlay-border justify-between flex"
        onClick={() => setActiveItem((prev) => !prev)}
      >
        <p className="text-sm font-bold text-white"> {title}</p>{" "}
        {activeItem ? (
          <ChevronUpIcon className="w-6 text-white" />
        ) : (
          <ChevronDownIcon className="w-6 text-white" />
        )}
      </div>
      <div
        className={clsx(
          " transition-all ease-out duration-500 overflow-hidden flex items-center",
          {
            "h-0": !activeItem,
          },
          {
            "h-auto": activeItem,
          },
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default AccordionMenu;
