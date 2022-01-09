import React from "react";
import { Icons } from "@shared/const/Icons";
import { getNftsMetadata } from "shared/web3";
import ItemDashboard from "./item/item";
import FiltersBoard from "./filters/filters";

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
  //       render: ItemListed,
  //     })),
  //     recentlySold: [],
  //   });
  // };

  return (
    <div className="w-full flex xl:flex-row flex-col md:px-8 px-4 min-h-screen pt-36 pb-10">
      <FiltersBoard />
      <div className="grid xl:grid-cols-2 grid-cols-1 xl:gap-8 mt-6"></div>
    </div>
  );
};

export default MarketplaceComponent;
