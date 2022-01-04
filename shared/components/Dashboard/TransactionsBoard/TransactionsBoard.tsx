import { Typography } from "@shared/components/common/typography";
import React from "react";
import clsx from "clsx";
import { Icons } from "@shared/const/Icons";

const navItems = [
  { title: "Last 24h", value: "last_24h" },
  { title: "7 days", value: "last_7d" },
  { title: "30 days", value: "last_30d" },
];

const platformItems = [
  { title: "TOTAL SALE", value: "48,580", icon: Icons.totalSale },
  { title: "TOTAL VOLUME", value: "1,541", value2: "$1,57M", icon: Icons.eth },
  { title: "AXIE SOLD", value: "1,200", icon: Icons.axieSold },
];

const TransactionsBoard = () => {
  const [columnSelected, setColumnSelected] = React.useState("last_24h");
  return (
    <div className="w-full flex flex-col">
      <div className="w-full rounded-md border-2 border-overlay-border">
        <div className="flex border-b-2 border-overlay-border">
          {navItems.map((item, index) => {
            return (
              <div
                key={"filterPlatform" + index}
                className="border-r-2 border-overlay-border cursor-pointer"
                onClick={() => setColumnSelected(item.value)}
              >
                <Typography
                  type="subTitle"
                  className={clsx(
                    {
                      "bg-primary-disabled": columnSelected === item.value,
                    },
                    "px-6 py-4 text-primary"
                  )}
                >
                  {item.title}
                </Typography>
              </div>
            );
          })}
        </div>
        <div className="flex flex-row py-10 px-8 gap-x-16">
          {platformItems.map((item, index) => {
            return (
              <PlatformMovements
                icon={item.icon}
                label={item.title}
                value={item.value}
                value2={item.value2 || ""}
                key={"platform-" + index}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const PlatformMovements = ({ icon, label, value, value2 }) => {
  return (
    <div className="flex items-center">
      <img src={icon} className="h-16 w-16" alt="" />
      <div className="pl-4">
        <Typography className="text-primary" type="label">
          {label}
        </Typography>
        <Typography type="subTitle" className="text-white">
          {value} {value2}
        </Typography>
      </div>
    </div>
  );
};

export default TransactionsBoard;
