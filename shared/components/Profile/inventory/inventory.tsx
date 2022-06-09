import {Button} from "@shared/components/common/button";
import {Typography} from "@shared/components/common/typography";
import {Icons} from "@shared/const/Icons";
import clsx from "clsx";
import React from "react";
import {useAppSelector} from "redux/store";
import {
  AppstoreOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Styles from "./styles.module.scss";
import NFTCard from "@shared/components/Marketplace/itemCard";
import { getBalance } from "@shared/web3";
import { useMoralis } from "react-moralis";
import Link from "next/link";
import { Images } from "@shared/const/Images";
import { convertArrayCards } from "@shared/components/common/convertCards";

const navItems = [
  { title: "Trading Cards", value: "trading_cards" },
  { title: "Packs", value: "packs" },
];

const Inventory = () => {
  const nfts = useAppSelector((state) => state.nfts);
  const { user } = useMoralis();
  const inventoryCards = nfts.balanceCards;
  const [inventoryPacks, setInventoryPacks] = React.useState([]);
  const [columnSelected, setColumnSelected] = React.useState("trading_cards");
  const [balance, setBalance] = React.useState("0");
  const [search, setSearch] = React.useState("");

  const cards = convertArrayCards();

  React.useEffect(() => {
    if (user?.get("ethAddress")) {
      handleSetBalance();
    }
  }, [user]);

  React.useEffect(() => {
    const arrayPacks = [];
    nfts.balancePacks.forEach((pack, index) => {
      arrayPacks.push({
        id: pack.id,
        quantity: pack.balance,
        image:
          index === 0
            ? Images.pack1
            : index === 1
            ? Images.pack2
            : index === 2
            ? Images.pack3
            : Images.pack4,
        name:
          index === 0
            ? "Common Pack"
            : index === 1
            ? "Rare Pack"
            : index === 2
            ? "Epic Pack"
            : "Legendary Pack",
      });
    });
    setInventoryPacks(arrayPacks);
  }, [nfts]);

  const handleSetBalance = async () => {
    const balance = await getBalance(user.get("ethAddress"));
    setBalance(balance);
  };
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
              key={"navBarItem-" + index}
              className={clsx(
                {
                  "bg-primary-disabled text-white":
                    columnSelected === item.value,
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
      <div className="flex">
        <div className="border flex items-center text-md justify-center border-primary rounded-xl px-4 py-2 md:w-64 w-40 ml-10">
          <div className="text-white text-xl flex items-center justify-center">
            <SearchOutlined />
          </div>
          <input
            type="text"
            className="ml-2 text-white bg-transparent w-full"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>
      <div
        className={clsx(
          "flex mb-10  justify-center",
          {
            [`${Styles.gray} flex-col items-center gap-6 h-72`]:
              (inventoryCards.length == 0 &&
                columnSelected === "trading_cards") ||
              (inventoryPacks.length == 0 && columnSelected === "packs"),
          },
          {
            ["gap-2 flex-wrap gap-2"]:
              (inventoryCards.length > 0 &&
                columnSelected === "trading_cards") ||
              (inventoryPacks.length > 0 && columnSelected === "packs"),
          }
        )}
      >
        {inventoryCards.length > 0 && columnSelected === "trading_cards" ? (
          inventoryCards
            .filter((card) =>
              cards[card.id].properties.name.value
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map((card) => {
              return (
                card.balance > 0 && (
                  <NFTCard
                    key={card.id}
                    id={card.id}
                    icon={cards[card.id].properties.image.value}
                    name={cards[card.id].properties.name.value}
                    balance={card.balance}
                    byId
                  />
                )
              );
            })
        ) : inventoryPacks.length > 0 && columnSelected === "packs" ? (
          inventoryPacks.map((pack, index) => {
            return (
              parseInt(pack.quantity) > 0 && (
                <Link href={`/PackDetailID/${pack.id}`} key={index}>
                  <div
                    className={clsx(
                      "rounded-xl p-4 flex flex-col text-white w-56 bg-secondary cursor-pointer"
                    )}
                  >
                    <div className="w-full flex flex-col text-xs gap-1">
                      <div className="w-full flex justify-end">
                        <span>X{pack.quantity}</span>
                      </div>
                    </div>
                    <div className="w-full h-36 flex justify-center items-center my-4">
                      <img src={pack.image} className={"h-36"} />
                    </div>
                    <div className="flex flex-col text-sm text-center">
                      <span>{pack.name}</span>
                    </div>
                  </div>
                </Link>
              )
            );
          })
        ) : (
          <>
            <img src={Icons.logo} className="h-40 w-40" alt="" />
            <Typography
              type="subTitle"
              className={clsx(Styles.title, "text-primary")}
            >
              You don't have any item yet
            </Typography>
          </>
        )}
      </div>
      ;
    </div>
  );
};

export default Inventory;
