import {Typography} from "@shared/components/common/typography";
import React from "react";
import clsx from "clsx";
import ItemListed from "./items/itemListed";

const navItems = [
  { title: "Trading Cards", value: "trading_cards" },
  { title: "Packs", value: "packs" },
  { title: "Comics", value: "comics" },
];

interface Props {
  title: string;
  data: (Record<string, string> & { render: React.FunctionComponent<any> })[];
}

const Table: React.FunctionComponent<Props> = ({ title, data }) => {
  const [columnSelected, setColumnSelected] = React.useState("trading_cards");
  return (
    <div className="w-full flex flex-col">
      <h2 className="text-white py-2">{title}</h2>
      <div className="w-full">
        <div className="flex rounded-t-md border-2 border-primary-disabled overflow-hidden">
          {navItems.map((item, index) => {
            return (
              <div
                className={clsx(
                  {
                    "bg-primary-disabled text-white":
                      columnSelected === item.value,
                  },

                  "border-r-2 border-primary-disabled cursor-pointer px-4 py-2 "
                )}
                onClick={() => setColumnSelected(item.value)}
                key={index}
              >
                <Typography
                  type="subTitle"
                  className={clsx({
                    "text-primary": columnSelected !== item.value,
                  })}
                >
                  {item.title}
                </Typography>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col border-2 border-primary-disabled border-t-0 border-b-0 w-full mb-20">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-max ">
              <tbody>
                {data.map((item, index) =>
                  title === "Recently Listed" ? (
                    <ItemListed
                      id={item.id}
                      type={title}
                      seller={item.seller}
                    ></ItemListed>
                  ) : (
                    <ItemListed
                      id={item.id}
                      type={title}
                      amount={item.amount}
                      buyer={item.buyer}
                    ></ItemListed>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
