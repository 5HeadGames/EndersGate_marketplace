import React from "react";

import { useAppDispatch, useAppSelector } from "@redux/store";
import Table from "./tableItems/table";
import TransactionsBoard from "./TransactionsBoard/TransactionsBoard";
import { getAddresses, getContract } from "@shared/web3";
import cardsJson from "../../../cards.json";
import { TimeConverter } from "../common/unixDateConverter/unixConverter";

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

      switch (listedSelected) {
        case "trading_cards":
          if (cardSalesCreated.length > 10) {
            const cardSalesCreatedReverse = cardSalesCreated
              .slice(cardSalesCreated.length - 10, cardSalesCreated.length)
              .reverse();
            setRecentlyListed(cardSalesCreatedReverse);
          } else {
            setRecentlyListed(cardSalesCreated.reverse());
          }
          break;
        case "packs":
          if (packSalesCreated.length > 10) {
            setRecentlyListed(
              packSalesCreated
                .slice(packSalesCreated.length - 10, packSalesCreated.length)
                .reverse()
            );
          } else {
            setRecentlyListed(packSalesCreated.reverse());
          }
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
          if (cardSalesSold.length > 10) {
            setRecentlySold(
              cardSalesSold
                .slice(cardSalesSold.length - 10, cardSalesSold.length)
                .reverse()
            );
          } else {
            setRecentlySold(cardSalesSold.reverse());
          }
          break;
        default:
          if (packSalesSold.length > 10) {
            setRecentlySold(
              packSalesSold

                .slice(packSalesSold.length - 10, packSalesSold.length)
                .reverse()
            );
          } else {
            setRecentlySold(packSalesSold.reverse());
          }
          break;
      }
      console.log(nfts);
      let timePeriod;
      switch (columnSelected) {
        case "last_24h":
          timePeriod = 3600 * 24 * 1000;
          break;
        case "last_7d":
          timePeriod = 3600 * 24 * 7 * 1000;
          break;
        case "last_30d":
          timePeriod = 3600 * 24 * 30 * 1000;
          break;
      }
      setTransactionsBoard({
        totalSale:
          nfts.saleCreated.length > 0
            ? nfts.saleCreated
                ?.map((sale, i): any => {
                  return new Date().valueOf() -
                    new Date(nfts.saleCreated[i].startedAt * 1000).valueOf() <
                    timePeriod
                    ? 1
                    : 0;
                })
                ?.reduce((acc, cur) => {
                  return acc + cur;
                })
            : 0,
        totalVolume:
          nfts.saleCreated.length > 0
            ? nfts.saleCreated
                ?.map((sale, i) => {
                  return new Date().valueOf() -
                    new Date(nfts.saleCreated[i].startedAt * 1000).valueOf() <
                    timePeriod
                    ? parseFloat(sale.price)
                    : 0;
                })
                ?.reduce((acc, cur) => {
                  return acc + cur;
                })
            : 0,
        cardsSold:
          nfts.saleSuccessfull.length > 0
            ? nfts.saleSuccessfull
                ?.map((sale, i) => {
                  return new Date().valueOf() -
                    new Date(nfts.saleCreated[i].startedAt * 1000).valueOf() <
                    timePeriod
                    ? sale.nft === endersGate
                      ? 1
                      : 0
                    : 0;
                })
                ?.reduce((acc: any, cur: any) => {
                  return acc + cur;
                })
            : 0,

        packsSold:
          nfts.saleSuccessfull.length > 0
            ? nfts.saleSuccessfull
                ?.map((sale, i) => {
                  return new Date().valueOf() -
                    new Date(nfts.saleCreated[i].startedAt * 1000).valueOf() <
                    timePeriod
                    ? sale.nft === pack
                      ? 1
                      : 0
                    : 0;
                })
                ?.reduce((acc: any, cur: any) => {
                  return acc + cur;
                })
            : 0,
      });
    }
  }, [nfts, listedSelected, soldSelected, columnSelected]);

  // React.useEffect(() => {
  // }, []);

  // React.useEffect(() => {
  //   const { endersGate, pack } = getAddresses();

  // }, [columnSelected]);

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
};;

export default DashboardComponent;
