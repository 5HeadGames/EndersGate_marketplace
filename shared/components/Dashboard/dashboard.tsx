import React from "react";

import { useAppSelector } from "@redux/store";
import Table from "./tableItems/table";
import TransactionsBoard from "./TransactionsBoard/TransactionsBoard";
import ItemListed from "./tableItems/items/itemListed";
import Web3 from "web3";
import { getAddresses, getContractWebSocket } from "@shared/web3";

const DashboardComponent = () => {
  const { nfts } = useAppSelector((state) => state);
  const { saleCreated, saleSuccessfull } = nfts;

  const [recentlyListed, setRecentlyListed] = React.useState([]);
  const [recentlySold, setRecentlySold] = React.useState([]);

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const addresses = await getAddresses();
    const contract = await getContractWebSocket(
      "ClockSale",
      addresses.marketplace
    );
    const eventsListedSold = await Promise.all([
      contract.getPastEvents("SaleCreated", {
        fromBlock: 23662353,
        toBlock: "latest",
      }),
      contract.getPastEvents("BuySuccessful", {
        fromBlock: 23662353,
        toBlock: "latest",
      }),
    ]);
    console.log("testing both", eventsListedSold);
    const eventsListed = eventsListedSold[0];
    const recentlyListed = [];
    eventsListed.forEach((event) => {
      recentlyListed.push({
        amount: event.returnValues._amount,
        duration: event.returnValues._duration,
        id: event.returnValues._auctionId,
        price: Web3.utils.fromWei(event.returnValues._price),
        seller: event.returnValues._seller,
      });
    });
    console.log(recentlyListed, "listed");
    setRecentlyListed(recentlyListed);
    const eventsSold = eventsListedSold[1];
    const recentlySold = [];
    eventsSold.forEach((event) => {
      recentlySold.push({
        amount: event.returnValues._nftAmount,
        id: event.returnValues._aucitonId,
        cost: Web3.utils.fromWei(event.returnValues._cost),
        buyer: event.returnValues._buyer,
      });
    });
    console.log(recentlySold, "sold");
    setRecentlySold(recentlySold);
  };

  return (
    <div className="w-full flex flex-col md:px-16 px-4 min-h-screen pt-36">
      <TransactionsBoard />
      <div className="grid xl:grid-cols-2 grid-cols-1 xl:gap-8 mt-6">
        <Table title="Recently Listed" data={recentlyListed} />
        <Table title="Recently Sold" data={recentlySold} />
      </div>
    </div>
  );
};

export default DashboardComponent;
