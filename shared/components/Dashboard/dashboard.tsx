import React from "react";

import { useAppDispatch, useAppSelector } from "@redux/store";
import Table from "./tableItems/table";
import TransactionsBoard from "./TransactionsBoard/TransactionsBoard";
import { getAddresses } from "@shared/web3";

const DashboardComponent = () => {
  const [recentlyListed, setRecentlyListed] = React.useState([]);
  const [recentlySold, setRecentlySold] = React.useState([]);
  const [transactionsBoard, setTransactionsBoard] = React.useState({
    totalSale: 0,
    totalVolume: 0,
    cardsSold: 0,
  });
  const [listedSelected, setListedSelected] = React.useState("trading_cards");
  const [soldSelected, setSoldSelected] = React.useState("trading_cards");
  const { nfts } = useAppSelector((state) => state);

  React.useEffect(() => {
    console.log(getAddresses());
    if (nfts) {
      setRecentlyListed(nfts.saleCreated);
      console.log(nfts.saleCreated);
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
    }
  }, [nfts]);

  React.useEffect(() => {
    switch (listedSelected) {
      case "trading_cards":
        setRecentlyListed(nfts.saleCreated);
        break;
      // case "packs":
      //   setRecentlyListed(nfts.saleCreated);
      //   break;
      default:
        setRecentlyListed(nfts.saleCreated);
        break;
    }

    switch (soldSelected) {
      case "trading_cards":
        setRecentlySold(nfts.saleSuccessfull);
        break;
      default:
        setRecentlyListed(nfts.saleCreated);
        break;
    }
  }, [listedSelected, soldSelected]);

  return (
    <div className="w-full flex flex-col md:px-16 pt-36 min-h-screen bg-overlay px-4">
      <TransactionsBoard
        totalSale={transactionsBoard.totalSale}
        totalVolume={transactionsBoard.totalVolume}
        cardsSold={transactionsBoard.cardsSold}
      />
      <div className="grid xl:grid-cols-2 grid-cols-1 xl:gap-8 mt-6">
        <Table
          title="Recently Listed"
          data={recentlyListed}
          columnSelected={listedSelected}
          setColumnSelected={setListedSelected}
        />
        <Table
          title="Recently Sold"
          data={recentlySold}
          columnSelected={soldSelected}
          setColumnSelected={setSoldSelected}
        />
      </div>
    </div>
  );
};

export default DashboardComponent;
