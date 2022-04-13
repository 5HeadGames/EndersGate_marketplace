import {Button} from "@shared/components/common/button";
import {Typography} from "@shared/components/common/typography";
import {Icons} from "@shared/const/Icons";
import clsx from "clsx";
import React from "react";
import {useAppSelector} from "redux/store";
import {AppstoreOutlined, UnorderedListOutlined} from "@ant-design/icons";
import Styles from "./styles.module.scss";
import NFTCard from "@shared/components/Marketplace/itemCard";
import cards from "../../../cards.json";
import {getBalance} from "@shared/web3";

const navItems = [
  {title: "Trading Cards", value: "trading_cards"},
  {title: "Packs", value: "packs"},
  {title: "Comics", value: "comics"},
];

const Inventory = () => {
  const nfts = useAppSelector((state) => state.nfts);
  const user = useAppSelector((state) => state.user);
  const inventory = nfts.balanceCards;
  const [columnSelected, setColumnSelected] = React.useState("trading_cards");
  const [balance, setBalance] = React.useState("0");
  React.useEffect(() => {
    if (user.address) {
      handleSetBalance();
    }
  }, [user]);

  const handleSetBalance = async () => {
    const balance = await getBalance(user.address);
    setBalance(balance);
  };

  React.useEffect(() => {
    console.log(nfts);
  }, []);
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center rounded-md border border-overlay-border p-4 w-56 gap-4">
        <img src={Icons.harmony} className="h-16 w-16" alt="" />
        <Typography type="title" className="text-primary">
          {balance} ONE
        </Typography>
      </div>
      <div className="flex rounded-t-md border-2 border-overlay-border mt-4 mb-4 overflow-hidden">
        {navItems.map((item, index) => {
          return (
            <div
              className={clsx(
                {
                  "bg-primary-disabled text-white": columnSelected === item.value,
                },
                {
                  "text-primary": columnSelected !== item.value,
                },
                "border-r-2 border-overlay-border cursor-pointer px-4 py-2 "
              )}
              onClick={() => setColumnSelected(item.value)}
            >
              <Typography type="subTitle">{item.title}</Typography>
            </div>
          );
        })}
      </div>
      {/* <div className="flex justify-end">
        <div className=" border-2 border rounded-md border-primary flex justify-center items-center overflow-hidden text-primary h-10">
          <div className="flex flex-1 justify-center items-center text-prymary h-10 border-r-2 border-primary p-2  cursor-pointer hover:bg-primary hover:text-secondary">
            <AppstoreOutlined />
          </div>
          <div className="flex flex-1 justify-center items-center text-primary h-10 p-2 cursor-pointer  hover:bg-primary hover:text-secondary">
            <UnorderedListOutlined />
          </div>
        </div>
      </div> */}
      <div
        className={clsx(
          "flex mb-10  justify-center",
          {
            [`${Styles.gray} flex-col items-center gap-6 h-72`]: inventory.length == 0,
          },
          {
            ["gap-2 flex-wrap gap-2"]: inventory.length > 0,
          }
        )}
      >
        {inventory.length > 0 ? (
          inventory.map((card) => {
            return (
              card.balance > 0 && (
                <NFTCard
                  id={card.id}
                  icon={cards.All[card.id].properties.image.value}
                  name={cards.All[card.id].properties.name.value}
                  balance={card.balance}
                  byId
                />
              )
            );
          })
        ) : (
          <>
            <img src={Icons.logo} className="h-40 w-40" alt="" />
            <Typography type="subTitle" className={clsx(Styles.title, "text-primary")}>
              You don't have any item yet
            </Typography>
          </>
        )}
      </div>
    </div>
  );
};

export default Inventory;
