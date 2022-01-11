import { Button } from "@shared/components/common/button";
import { Typography } from "@shared/components/common/typography";
import { Icons } from "@shared/const/Icons";
import clsx from "clsx";
import React from "react";
import "shared/firebase";
import { useAppSelector } from "redux/store";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import Styles from "./styles.module.scss";

const navItems = [
  { title: "Trading Cards", value: "trading_cards" },
  { title: "Packs", value: "packs" },
  { title: "Comics", value: "comics" },
];

const Inventory = () => {
  const user = useAppSelector((state) => state.user);
  const [columnSelected, setColumnSelected] = React.useState("trading_cards");
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center rounded-md border border-overlay-border p-4 w-56 gap-4">
        <img src={Icons.harmony} className="h-16 w-16" alt="" />
        <Typography type="title" className="text-primary">
          0 ONE
        </Typography>
      </div>
      <div className="flex rounded-t-md border-2 border-overlay-border mt-4 mb-4">
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
      <div className="flex justify-end">
        <div className=" border-2 border rounded-md border-primary flex justify-center items-center overflow-hidden text-primary h-10">
          <div className="flex flex-1 justify-center items-center text-prymary h-10 border-r-2 border-primary p-2  cursor-pointer hover:bg-primary hover:text-secondary">
            <AppstoreOutlined />
          </div>
          <div className="flex flex-1 justify-center items-center text-primary h-10 p-2 cursor-pointer  hover:bg-primary hover:text-secondary">
            <UnorderedListOutlined />
          </div>
        </div>
      </div>
      <div
        className={clsx(
          Styles.gray,
          "h-72 w-full ",
          "flex flex-col justify-center items-center gap-6"
        )}
      >
        <img src={Icons.logo} className="h-40 w-40" alt="" />
        <Typography
          type="subTitle"
          className={clsx(Styles.title, "text-primary")}
        >
          You don't have any item yet
        </Typography>
      </div>
    </div>
  );
};

export default Inventory;
