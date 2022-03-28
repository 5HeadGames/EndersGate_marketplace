import React from "react";
import {
  AppstoreOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";

import NftCard from "shared/components/Marketplace/itemCard";
import FiltersBoard from "./filters/filters";
import { DropdownActions } from "../common/dropdownActions/dropdownActions";
import { Dropdown } from "../common/dropdown/dropdown";
import clsx from "clsx";
import { Typography } from "../common/typography";

const MarketplaceComponent = () => {
  const [currentOrder, setCurrentOrder] = React.useState("lowest_price");
  const [filterMobile, setFilterMobile] = React.useState(false);
  const router = useRouter();

  const orderMapper = {
    lowest_price: "Lowest Price",
    highest_price: "Highest Price",
    recently_listed: "Recently Listed",
    older_listed: "Older Listed",
  };

  const [filter, setFilter] = React.useState({
    avatar: false,
    champions: false,
    action_cards: false,
    reaction_cards: false,
    tanks: false,
    damage: false,
    mages: false,
    healers: false,
    void: false,
    fire: false,
    water: false,
    mystic: false,
    earth: false,
    venom: false,
    wood: false,
    stone: false,
    iron: false,
    epic: false,
    legendary: false,
    limited_edition: false,
    attack: false,
    damage_stats: false,
    mages_stats: false,
  });

  return (
    <div className="w-full flex xl:flex-row flex-col md:px-8 px-4 pt-36 pb-10">
      <FiltersBoard filter={filter} setFilter={setFilter} />
      <div className="xl:w-2/3 xl:mt-0 mt-6 flex flex-col">
        <div>
          <div className="w-full flex justify-between items-center sm:flex-row flex-col">
            <h3 className="text-2xl text-primary ml-4 sm:mb-0 mb-4">
              619,801 Cards
            </h3>
            <div className="flex">
              <DropdownActions
                title={orderMapper[currentOrder]}
                actions={[
                  {
                    label: "Lowest Price",
                    onClick: () => setCurrentOrder("lowest_price"),
                  },
                  {
                    label: "Highest Price",
                    onClick: () => setCurrentOrder("highest_price"),
                  },
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

              <div className=" border-2 border rounded-md overflow-hidden border-primary flex justify-center items-center text-primary h-10 ml-4">
                <div className="flex flex-1 justify-center items-center text-primary h-10 border-r-2 border-primary p-2 cursor-pointer hover:bg-primary hover:text-secondary">
                  <AppstoreOutlined />
                </div>
                <div className="flex flex-1 justify-center items-center text-primary h-10 p-2 cursor-pointer hover:bg-primary hover:text-secondary">
                  <UnorderedListOutlined />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap w-full justify-center items-center relative">
            {new Array(6).fill(0).map((a, id) => (
              <NftCard
                classes={{ root: "m-4 cursor-pointer" }}
                onClick={() => router.push(`collectable/${id}`)}
              />
            ))}
            {filterMobile && (
              <div className={clsx("flex absolute w-screen")}>
                <FiltersBoard filter={filter} setFilter={setFilter} />{" "}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceComponent;
