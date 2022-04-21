import React from "react";
import {
  AppstoreOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {useRouter} from "next/router";

import NftCard from "shared/components/Marketplace/itemCard";
import FiltersBoard from "./filters/filters";
import {DropdownActions} from "../common/dropdownActions/dropdownActions";
import {Dropdown} from "../common/dropdown/dropdown";
import clsx from "clsx";
import { Typography } from "../common/typography";
import { getAddresses, getContract } from "@shared/web3";
import { onLoadSales } from "@redux/actions";
import cards from "../../cards.json";
import packs from "../../packs.json";
import { useAppDispatch, useAppSelector } from "@redux/store";
import Link from "next/link";

const MarketplaceComponent = () => {
  const [currentOrder, setCurrentOrder] = React.useState("older_listed");
  const [type, setType] = React.useState("trading_cards");
  const [sales, setSales] = React.useState([]);
  const { nfts } = useAppSelector((state) => state);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const orderMapper = {
    lowest_price: "Lowest Price",
    highest_price: "Highest Price",
    recently_listed: "Recently Listed",
    older_listed: "Older Listed",
  };

  React.useEffect(() => {
    getSales(currentOrder);
  }, [currentOrder]);

  React.useEffect(() => {}, [sales]);

  const getSales = async (currentOrder: string) => {
    const { endersGate, pack } = getAddresses();
    const cardSalesCreated = [];
    const packSalesCreated = [];
    nfts.saleCreated.forEach((sale) => {
      if (sale.nft == endersGate) {
        cardSalesCreated.push(sale);
      } else if (sale.nft == pack) {
        packSalesCreated.push(sale);
      }
    });

    if (currentOrder === "recently_listed") {
      switch (type) {
        case "trading_cards":
          setSales(cardSalesCreated.reverse());
          break;
        case "packs":
          setSales(packSalesCreated.reverse());
          break;
        default:
          setSales(nfts.saleCreated.reverse());
          break;
      }
      // const salesCreated: any[] = [...cardSalesCreated];
      // setSales(salesCreated.reverse());
    } else if (currentOrder === "older_listed") {
      switch (type) {
        case "trading_cards":
          setSales(cardSalesCreated);
          break;
        case "packs":
          setSales(packSalesCreated);
          break;
        default:
          setSales(nfts.saleCreated);
          break;
      }
    } else {
      switch (type) {
        case "trading_cards":
          setSales(cardSalesCreated);
          break;
        case "packs":
          setSales(packSalesCreated);
          break;
        default:
          setSales(nfts.saleCreated);
          break;
      }
    }
  };

  React.useEffect(() => {
    const cardSalesCreated = [];
    const packSalesCreated = [];
    const { endersGate, pack } = getAddresses();
    nfts.saleCreated.forEach((sale) => {
      if (sale.nft == endersGate) {
        cardSalesCreated.push(sale);
      } else if (sale.nft == pack) {
        packSalesCreated.push(sale);
      }
    });
    console.log(cardSalesCreated, "Cards");
    switch (type) {
      case "trading_cards":
        setSales(cardSalesCreated);
        break;
      case "packs":
        setSales(packSalesCreated);
        break;
      default:
        setSales(nfts.saleCreated);
        break;
    }
  }, [type, nfts]);

  const [filter, setFilter] = React.useState({
    avatar: false,
    guardian: false,
    action_cards: false,
    reaction_cards: false,
    // tanks: false,
    // damage: false,
    // mages: false,
    // healers: false,
    // void: false,
    // fire: false,
    // water: false,
    // mystic: false,
    // earth: false,
    // venom: false,
    wood: false,
    stone: false,
    iron: false,
    gold: false,
    legendary: false,
    // limited_edition: false,
    // attack: false,
    // damage_stats: false,
    // mages_stats: false,
    common: false,
    rare: false,
    ultra_rare: false,
    uncommon: false,
  });

  const passFilter = (id: any) => {
    let passed = false;
    if (filter.guardian && id >= 54) {
      passed = true;
    }
    // if (filter.avatar) {

    // }
    if (
      filter.common &&
      id <= 53 &&
      cards.All[id]?.properties?.rarity?.value.toLowerCase() === "common"
    ) {
      passed = true;
    }
    if (
      filter.uncommon &&
      id <= 53 &&
      cards.All[id]?.properties?.rarity?.value.toLowerCase() === "uncommon"
    ) {
      passed = true;
    }
    if (
      filter.rare &&
      id <= 53 &&
      cards.All[id]?.properties?.rarity?.value.toLowerCase() === "rare"
    ) {
      passed = true;
    }
    if (
      filter.ultra_rare &&
      id <= 53 &&
      cards.All[id]?.properties?.rarity?.value.toLowerCase() === "ultra rare"
    ) {
      passed = true;
    }
    if (filter.reaction_cards && id <= 53) {
      passed = true;
    }
    if (filter.action_cards && id >= 22 && id <= 53) {
      passed = true;
    }
    if (filter.wood && id >= 54 && id <= 70) {
      passed = true;
    }
    if (filter.stone && id >= 71 && id <= 87) {
      passed = true;
    }
    if (filter.iron && id >= 88 && id <= 101) {
      passed = true;
    }
    if (filter.gold && id >= 102 && id <= 117) {
      passed = true;
    }
    if (filter.legendary && id >= 118) {
      passed = true;
    }

    let thereIsFilters = false;
    console.log(Object.values(filter));
    Object.values(filter).forEach((element) => {
      if (element) {
        thereIsFilters = true;
      }
    });
    if (!thereIsFilters) {
      return true;
    }
    return passed;
  };

  return (
    <div className="w-full flex xl:flex-row flex-col md:px-8 px-4 pt-36 pb-10 min-h-screen">
      <FiltersBoard
        filter={filter}
        setFilter={setFilter}
        type={type}
        setType={setType}
      />
      <div className="xl:w-2/3 xl:mt-0 mt-6 flex flex-col pb-10">
        <div>
          <div className="w-full flex justify-between items-center sm:flex-row flex-col">
            <h3 className="text-2xl text-primary ml-4 sm:mb-0 mb-4">
              {sales?.length} Sales
            </h3>
            <div className="flex">
              <DropdownActions
                title={orderMapper[currentOrder]}
                actions={[
                  // {
                  //   label: "Lowest Price",
                  //   onClick: () => setCurrentOrder("lowest_price"),
                  // },
                  // {
                  //   label: "Highest Price",
                  //   onClick: () => setCurrentOrder("highest_price"),
                  // },
                  {
                    label: "Recently Listed",
                    onClick: () => setCurrentOrder("recently_listed"),
                  },
                  {
                    label: "Older Listed",
                    onClick: () => setCurrentOrder("older_listed"),
                  },
                ]}
              />

              {/* <div className=" border-2 border rounded-md overflow-hidden border-primary flex justify-center items-center text-primary h-10 ml-4">
                <div className="flex flex-1 justify-center items-center text-primary h-10 border-r-2 border-primary p-2 cursor-pointer hover:bg-primary hover:text-secondary">
                  <AppstoreOutlined />
                </div>
                <div className="flex flex-1 justify-center items-center text-primary h-10 p-2 cursor-pointer hover:bg-primary hover:text-secondary">
                  <UnorderedListOutlined />
                </div>
              </div>*/}
            </div>
          </div>
          <div className="flex flex-wrap w-full justify-center items-center relative">
            {sales?.map((a, id) => {
              // if(passFilter(a.nftId)){
              console.log(a);
              return type !== "packs" ? (
                passFilter(a.nftId) && (
                  <NftCard
                    classes={{ root: "m-4 cursor-pointer" }}
                    id={a.nftId}
                    transactionId={a.id}
                    icon={cards.All[a.nftId].properties.image.value}
                    name={cards.All[a.nftId].properties.name.value}
                    byId={false}
                  />
                )
              ) : (
                <Link href={`/NFTDetailSale/${a.id}`}>
                  <div
                    className={clsx(
                      "rounded-xl p-4 flex flex-col text-white w-56 bg-secondary cursor-pointer m-4 cursor-pointer"
                    )}
                  >
                    <div className="w-full flex flex-col text-xs gap-1">
                      <div className="w-full flex justify-between">
                        <span>Pack{a.nftId}</span>
                        <span>#{a.id}</span>
                      </div>
                    </div>
                    <div className="w-full h-36 flex justify-center items-center my-4">
                      <img
                        src={packs[a.nftId]?.properties?.image?.value}
                        className={"h-36"}
                      />
                    </div>
                    <div className="flex flex-col text-sm text-center">
                      <span>{a.name}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceComponent;
