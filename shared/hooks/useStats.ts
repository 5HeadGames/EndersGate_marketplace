import { getAddresses } from "@shared/web3";
import React from "react";
import Web3 from "web3";

export const useStats = ({
  nfts,
  listedSelected,
  soldSelected,
  columnSelected,
}) => {
  const [recentlyListed, setRecentlyListed] = React.useState([]);
  const [recentlySold, setRecentlySold] = React.useState([]);
  const [transactionsBoard, setTransactionsBoard] = React.useState({
    totalSale: 0,
    totalVolume: 0,
    cardsSold: 0,
    packsSold: 0,
  });

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
          if (cardSalesCreated.length > 12) {
            const cardSalesCreatedReverse = cardSalesCreated
              .slice(cardSalesCreated.length - 12, cardSalesCreated.length)
              .reverse();
            setRecentlyListed(cardSalesCreatedReverse);
          } else {
            setRecentlyListed(cardSalesCreated.reverse());
            console.log(cardSalesCreated);
          }
          break;
        case "packs":
          if (packSalesCreated.length > 12) {
            setRecentlyListed(
              packSalesCreated
                .slice(packSalesCreated.length - 12, packSalesCreated.length)
                .reverse(),
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
          if (cardSalesSold.length > 12) {
            setRecentlySold(
              cardSalesSold
                .slice(cardSalesSold.length - 12, cardSalesSold.length)
                .reverse(),
            );
          } else {
            setRecentlySold(cardSalesSold.reverse());
          }
          break;
        default:
          if (packSalesSold.length > 12) {
            setRecentlySold(
              packSalesSold
                .slice(packSalesSold.length - 12, packSalesSold.length)
                .reverse(),
            );
          } else {
            setRecentlySold(packSalesSold.reverse());
          }
          break;
      }
      let timePeriod;
      switch (columnSelected) {
        case "last_7d":
          timePeriod = 3600 * 24 * 7 * 1000;
          break;
        case "last_30d":
          timePeriod = 3600 * 24 * 30 * 1000;
          break;
        case "last_90d":
          timePeriod = 3600 * 24 * 90 * 1000;
          break;
        case "forever":
          timePeriod = 3600 * 24 * 30 * 1000 * 1000;
          break;
      }
      setTransactionsBoard({
        totalSale:
          nfts.saleCreated.length > 0
            ? nfts.saleCreated
                ?.map((sale, i): any => {
                  return new Date().valueOf() -
                    new Date(nfts.saleCreated[i]?.startedAt * 1000).valueOf() <
                    timePeriod
                    ? 1
                    : 0;
                })
                ?.reduce((acc, cur) => {
                  return acc + cur;
                })
            : 0,
        totalVolume:
          nfts.saleSuccessfull.length > 0
            ? nfts.saleSuccessfull
                ?.map((sale, i) => {
                  return new Date().valueOf() -
                    new Date(
                      nfts.saleSuccessfull[i].startedAt * 1000,
                    ).valueOf() <
                    timePeriod
                    ? parseInt(sale.price) / 10 ** 6
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
                    new Date(
                      nfts.saleSuccessfull[i].startedAt * 1000,
                    ).valueOf() <
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
                    new Date(
                      nfts.saleSuccessfull[i].startedAt * 1000,
                    ).valueOf() <
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

  return {
    recentlyListed,
    recentlySold,
    transactionsBoard,
  };
};
