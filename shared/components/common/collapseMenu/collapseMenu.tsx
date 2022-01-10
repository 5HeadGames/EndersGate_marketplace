import * as React from "react";
import clsx from "clsx";
import { Typography } from "../typography";
import { Icons } from "@shared/const/Icons";

export const CollapseMenu: React.FC<any> = ({ children, title }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="text-right">
      <div className="relative inline-block text-left w-full">
        <div className="w-full">
          <div className="inline-flex w-full text-sm font-medium bg-transparent focus:outline-none">
            <div
              className={clsx("border-none flex items-center cursor-pointer")}
              onClick={() => setOpen((prev) => !prev)}
            >
              <img
                src={Icons.upArrow}
                style={{ transform: `rotate(${open ? "180deg" : "0"})` }}
              />
              <Typography className="text-primary ml-2" type="subTitle">
                {title}
              </Typography>
            </div>
          </div>
        </div>
        <div
          className={clsx(
            { ["hidden"]: !open },
            "flex top-0 right-0 origin-top-right mt-2 bg-white divide-y rounded-b-10 focus:outline-none"
          )}
        >
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};
