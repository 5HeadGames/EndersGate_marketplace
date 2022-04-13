import React from "react";

import { useAppDispatch, useAppSelector } from "@redux/store";
import Table from "./tableItems/table";
import TransactionsBoard from "./TransactionsBoard/TransactionsBoard";
import ItemListed from "./tableItems/items/itemListed";
import Web3 from "web3";
import { getAddresses, getContractWebSocket } from "@shared/web3";
import { onLoadSales } from "@redux/actions";

const DashboardComponent = () => {
  
  const [recentlyListed, setRecentlyListed] = React.useState([]);
  const [recentlySold, setRecentlySold] = React.useState([]);
  const [transactionsBoard, setTransactionsBoard] = React.useState({
    totalSale: 0,
    totalVolume: 0,
    cardsSold: 0,
  });
  const dispatch = useAppDispatch();
  const { nfts } = useAppSelector((state) => state);

  React.useEffect(() => {
    if (nfts) {
      setRecentlyListed(nfts.saleCreated);
      setRecentlySold(nfts.saleSuccessfull);

      setTransactionsBoard({
        totalSale: nfts.totalSales,
        totalVolume:
          nfts.saleCreated.length > 0
            ? nfts.saleCreated
                ?.map((sale) => parseFloat(sale.price))
                ?.reduce((acc, cur) => {
                  return acc + cur;
                })
            : 0,
        cardsSold: nfts.cardsSold,
      });
      console.log(nfts.saleCreated);
    }
  }, [nfts]);

  return (
    <div className="w-full flex flex-col md:px-16 px-4 min-h-screen pt-36">
      <TransactionsBoard
        totalSale={transactionsBoard.totalSale}
        totalVolume={transactionsBoard.totalVolume}
        cardsSold={transactionsBoard.cardsSold}
      />
      <div className="grid xl:grid-cols-2 grid-cols-1 xl:gap-8 mt-6">
        <Table title="Recently Listed" data={recentlyListed} />
        <Table title="Recently Sold" data={recentlySold} />
      </div>
    </div>
  );
};

export default DashboardComponent;
