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
    packsSold: 0,
  });
  const [columnSelected, setColumnSelected] = React.useState("last_24h");
  const [listedSelected, setListedSelected] = React.useState("trading_cards");
  const [soldSelected, setSoldSelected] = React.useState("trading_cards");
  const { nfts } = useAppSelector((state) => state);

  React.useEffect(() => {
    const { endersGate, pack } = getAddresses();
    if (nfts) {
      const cardSalesCreated = [];
      const packSalesCreated = [];
      nfts.saleCreated.forEach((sale) => {
        if (sale.nft == endersGate) {
          cardSalesCreated.push(sale);
        } else if (sale.nft == pack) {
          packSalesCreated.push(sale);
        }
      });
      setRecentlyListed(cardSalesCreated);

      const cardSalesSold = [];
      const packSalesSold = [];
      nfts.saleSuccessfull.forEach((sale) => {
        if (sale.nft == endersGate) {
          cardSalesSold.push(sale);
        } else if (sale.nft == pack) {
          packSalesSold.push(sale);
        }
      });
      setRecentlySold(cardSalesSold);
      console.log(nfts.saleSuccessfull);
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
        cardsSold:
          nfts.saleSuccessfull.length > 0
            ? nfts.saleSuccessfull
                ?.map((sale) => (sale.nft === endersGate ? 1 : 0))
                ?.reduce((acc: any, cur: any) => {
                  return acc + cur;
                })
            : 0,

        packsSold:
          nfts.saleSuccessfull.length > 0
            ? nfts.saleSuccessfull
                ?.map((sale) => (sale.nft === pack ? 1 : 0))
                ?.reduce((acc: any, cur: any) => {
                  return acc + cur;
                })
            : 0,
      });
    }
  }, [nfts]);

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
    switch (listedSelected) {
      case "trading_cards":
        setRecentlyListed(cardSalesCreated);
        break;
      case "packs":
        setRecentlyListed(packSalesCreated);
        break;
      default:
        setRecentlyListed(nfts.saleCreated);
        break;
    }

    const cardSalesSold = [];
    const packSalesSold = [];
    nfts.saleSuccessfull.forEach((sale) => {
      if (sale.nft == endersGate) {
        cardSalesSold.push(sale);
      } else if (sale.nft == pack) {
        packSalesSold.push(sale);
      }
    });

    switch (soldSelected) {
      case "trading_cards":
        setRecentlySold(cardSalesSold);
        break;
      default:
        setRecentlySold(packSalesSold);
        break;
    }
  }, [listedSelected, soldSelected]);

  React.useEffect(() => {
    switch (columnSelected) {
      case "last_24h":
        break;
      case "last_7d":
        break;
      case "last_30d":
        break;
    }
  }, [columnSelected]);

  return (
    <div className="w-full flex flex-col md:px-16 pt-36 min-h-screen bg-overlay px-4 pb-24">
      <TransactionsBoard
        totalSale={transactionsBoard.totalSale}
        totalVolume={transactionsBoard.totalVolume}
        cardsSold={transactionsBoard.cardsSold}
        packsSold={transactionsBoard.packsSold}
        columnSelected={columnSelected}
        setColumnSelected={setColumnSelected}
      />
      <div className="grid xl:grid-cols-2 grid-cols-1 xl:gap-8 mt-6">
        <Table
          title="Recently Listed"
          data={recentlyListed}
          columnSelected={listedSelected}
          setColumnSelected={setListedSelected}
          pack={listedSelected === "packs"}
        />
        <Table
          title="Recently Sold"
          data={recentlySold}
          columnSelected={soldSelected}
          setColumnSelected={setSoldSelected}
          pack={soldSelected === "packs"}
        />
      </div>
    </div>
  );
};

export default DashboardComponent;
