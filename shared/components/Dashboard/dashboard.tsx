import React from "react";

import {useAppSelector} from "@redux/store";
import Table from "./tableItems/table";
import TransactionsBoard from "./TransactionsBoard/TransactionsBoard";
import ItemListed from "./tableItems/items/itemListed";

const DashboardComponent = () => {
  const {nfts} = useAppSelector((state) => state);
  const {saleCreated, saleSuccessfull} = nfts;

  return (
    <div className="w-full flex flex-col md:px-16 px-4 min-h-screen pt-36">
      <TransactionsBoard />
      <div className="grid xl:grid-cols-2 grid-cols-1 xl:gap-8 mt-6">
        <Table title="Recently Listed" data={saleCreated} />
        <Table title="Recently Sold" data={saleSuccessfull} />
      </div>
    </div>
  );
};

export default DashboardComponent;
