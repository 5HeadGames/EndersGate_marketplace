import { Typography } from "@shared/components/common/typography";
import React from "react";
import clsx from "clsx";
import { Icons } from "@shared/const/Icons";
import ItemSold from "./items/itemSold";
import TransactionsBoard from "../TransactionsBoard/TransactionsBoard";

const navItems = [
  { title: "Trading Cards", value: "trading_cards" },
  { title: "Forks", value: "forks" },
  { title: "Comics", value: "comics" },
];

const itemsSold = [
  {
    icon: Icons.logo,
    bread_count: 4,
    id: 15456468,
    buyer: {
      nickname: "CarlTroubleMaker",
      address: "0x45646a68dd4a68456420aaaa",
    },
    seller: {
      nickname: "CarlTroubleMaker2",
      address: "0x45646a68dd4a684564211117",
    },
    price: { eth: "1", dollars: "4000" },
    timeAgo: "a minute ago",
  },
  {
    icon: Icons.logo,
    bread_count: 4,
    id: 15456468,
    buyer: {
      nickname: "CarlTroubleMaker3",
      address: "0x45646a68dd4a684564202137",
    },
    seller: {
      nickname: "CarlTroubleMaker34",
      address: "0x45646a68dd4a6845642044897",
    },
    price: { eth: "1", dollars: "4000" },
    timeAgo: "a minute ago",
  },
  {
    icon: Icons.logo,
    bread_count: 4,
    id: 15456468,
    buyer: {
      nickname: "CarlTroubleMaker345",
      address: "0x45646a68dd4a68456420988",
    },
    seller: {
      nickname: "CarlTroubleMaker4684",
      address: "0x45646a68dd4a684564209002",
    },
    price: { eth: "1", dollars: "4000" },
    timeAgo: "2 minutes ago",
  },
];

const Table = ({ title }) => {
  const [columnSelected, setColumnSelected] = React.useState("trading_cards");
  return (
    <div className="w-full flex flex-col">
      <h2 className="text-white py-2">{title}</h2>
      <div className="w-full">
        <div className="flex rounded-t-md border-2 border-overlay-border">
          {navItems.map((item, index) => {
            return (
              <div
                className={clsx(
                  {
                    "bg-primary-disabled": columnSelected === item.value,
                  },
                  "border-r-2 border-overlay-border cursor-pointer px-4 py-2 "
                )}
                onClick={() => setColumnSelected(item.value)}
              >
                <Typography type="subTitle" className={clsx("text-primary")}>
                  {item.title}
                </Typography>
              </div>
            );
          })}
        </div>
        {title === "Recently Sold" && (
          <div className="flex flex-col border-2 border-overlay-border border-t-0 border-b-0 w-full">
            <div className="w-full">
              <table className="w-full">
                <tbody>
                  {itemsSold.map((item, index) => {
                    return (
                      <ItemSold key={"itemSold-" + index} transaction={item} />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {title === "Recently Listed" && (
          <div className="flex flex-col border-2 border-overlay-border border-t-0 border-b-0 w-full">
            <div className="w-full">
              <table className="w-full">
                <tbody>
                  {itemsSold.map((item, index) => {
                    return (
                      <ItemSold key={"itemSold-" + index} transaction={item} />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
