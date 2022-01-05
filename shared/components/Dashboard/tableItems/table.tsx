import { Typography } from "@shared/components/common/typography";
import React from "react";
import clsx from "clsx";
import { Icons } from "@shared/const/Icons";
import TransactionsBoard from "../TransactionsBoard/TransactionsBoard";

const navItems = [
  { title: "Trading Cards", value: "trading_cards" },
  { title: "Packs", value: "packs" },
  { title: "Comics", value: "comics" },
];


interface Props{
  title:string;
  data:(Record<string,string> & {render:React.FunctionComponent<any>})[];
}

const Table:React.FunctionComponent<Props> = ({ title ,data}) => {
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
        <div className="flex flex-col border-2 border-overlay-border border-t-0 border-b-0 w-full mb-20">
          <div className="w-full overflow-x-scroll">
            <table className="w-full min-w-max ">
              <tbody>
                {data.map((item, index) => (
                  <item.render {...item} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
