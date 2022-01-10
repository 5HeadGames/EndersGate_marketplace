import React from "react";
import { Icons } from "@shared/const/Icons";
import { getNftsMetadata } from "shared/web3";
import ItemDashboard from "./item/item";
import FiltersBoard from "./filters/filters";
import Styles from "./styles.module.scss";
import clsx from "clsx";

const MarketplaceComponent = () => {
  // const [{ recentlyListed, recentlySold }, setTableItems] = React.useState({
  //   recentlyListed: [],
  //   recentlySold: [],
  // });

  // const getListedAndSold = async () => {
  //   const nftsMock = await getNftsMetadata();
  //   setTableItems({
  //     recentlyListed: nftsMock.map((nft) => ({
  //       ...nft,
  //       icon: nft.image,
  //       breed_count: 1,
  //       price: { eth: "1", dollars: "4000" },
  //       timeAgo: "a minute ago",
  //       render: ItemDashboard,
  //     })),
  //     recentlySold: [],
  //   });
  // };

  // React.useEffect(() => {
  //   getListedAndSold();
  // }, []);

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
    <div className="w-full flex xl:flex-row flex-col md:px-8 px-4 min-h-screen pt-36 pb-10">
      <FiltersBoard filter={filter} setFilter={setFilter} />
      <div className="w-full flex flex-col">
        <div
          className={clsx(Styles.gridContainer, "grid  xl:gap-8 mt-6")}
        ></div>
      </div>
    </div>
  );
};

export default MarketplaceComponent;
