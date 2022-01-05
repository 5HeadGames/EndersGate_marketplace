import React from "react";

import { Icons } from "@shared/const/Icons";
import Table from "./tableItems/table";
import TransactionsBoard from "./TransactionsBoard/TransactionsBoard";
import ItemSold from "./tableItems/items/itemSold";
import ItemListed from "./tableItems/items/itemListed";
import {getNftsMetadata} from 'shared/web3'


const DashboardComponent = () => {
  const [{recentlyListed,recentlySold},setTableItems] = React.useState({recentlyListed:[],recentlySold:[]})

  const getListedAndSold = async ()=>{
    const nftsMock = await getNftsMetadata();
    setTableItems({recentlyListed:nftsMock.map(nft=>({
      ...nft,
      icon:nft.image,
      breed_count: 1,
      price: { eth: "1", dollars: "4000" },
      timeAgo: "a minute ago",
      render:ItemListed,
    })),recentlySold:[]});
  }

  React.useEffect(()=>{
    getListedAndSold();
  },[]);

  return (
    <div className="w-full flex flex-col md:px-16 px-4 min-h-screen">
      <TransactionsBoard />
      <div className="grid xl:grid-cols-2 grid-cols-1 xl:gap-8 mt-6">
        <Table title="Recently Listed" data={recentlyListed} />
        <Table title="Recently Sold" data={recentlySold} />
      </div>
    </div>
  );
};

export default DashboardComponent;
